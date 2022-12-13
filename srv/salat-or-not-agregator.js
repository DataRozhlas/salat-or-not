const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const axios = require("axios");
const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();

async function uploadFileOnS3(fileData, fileName) {
  const params = {
    Bucket: "datarozhlas",
    Key: fileName,
    Body: JSON.stringify(fileData),
    ACL: "public-read",
    ContentType: "application/json",
  };

  try {
    const response = await s3.upload(params).promise();
    console.log("Response: ", response);
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function getDataFromAPI(url, params) {
  return await axios
    .get(url, params)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.error("error");
    });
}

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

const params = {
  DistributionId: "E3ABKG4QXPTL3P",
  /* required */
  InvalidationBatch: {
    /* required */
    CallerReference: String(Date.now()),
    /* required */
    Paths: {
      /* required */
      Quantity: 2,
      /* required */
      Items: [
        "/hot-or-not-results/salat-stats.json",
        "/hot-or-not-results/salat-status.json",
      ],
    },
  },
};

exports.handler = async (event, context) => {
  let allData = [];

  const getAllData = async params => {
    let data = await dynamo.scan(params).promise();
    //console.log(data);
    if (data["Items"].length > 0) {
      allData = [...allData, ...data["Items"]];
    }

    if (data.LastEvaluatedKey) {
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      return await getAllData(params);
    } else {
      return data;
    }
  };

  const lastID = await getDataFromAPI(
    "https://datarozhlas.s3.eu-central-1.amazonaws.com/hot-or-not-results/salat-status.json",
    {}
  );
  const oldData = await getDataFromAPI(
    "https://datarozhlas.s3.eu-central-1.amazonaws.com/hot-or-not-results/salat-stats.json",
    {}
  );

  try {
    await getAllData({
      TableName: "salat-or-not",
    });

    const jenPlatne = await allData.filter(item => item.uid > lastID.lastID);
    const winners = await groupBy(jenPlatne, "winnerID");

    const losers = await groupBy(jenPlatne, "loserID");

    const winIDs = await Object.keys(winners);
    const losIDs = await Object.keys(losers);

    const allIDs = await [
      ...new Set([...Object.keys(winners), ...Object.keys(losers)]),
    ];

    const newData = await allIDs.map(id => {
      return {
        id: +id,
        w: winIDs.includes(id) ? winners[id].length : 0,
        l: losIDs.includes(id) ? losers[id].length : 0,
        c: allIDs
          .map(i => {
            if (i === id) {
              return { id: +i };
            }
            return {
              id: +i,
              w: winIDs.includes(i)
                ? winners[i].filter(j => j.loserID === +id).length
                : 0,
              l: losIDs.includes(i)
                ? losers[i].filter(j => j.winnerID === +id).length
                : 0,
            };
          })
          .filter(item => item.id !== +id),
      };
    });

    const result = oldData.map((item, i) => {
      const newItem = newData.find(n => n.id === item.id);
      if (typeof newItem === "undefined") {
        return item;
      }
      return {
        id: item.id,
        w: item.w + (newItem.w ?? 0),
        l: item.l + (newItem.l ?? 0),
        c: item.c.map((subItem, i) => {
          const newSubItem = newItem.c.find(n => n.id === subItem.id);
          if (typeof newSubItem === "undefined") {
            return subItem;
          }
          return {
            id: subItem.id,
            w: subItem.w + (newSubItem.w ?? 0),
            l: subItem.l + (newSubItem.l ?? 0),
          };
        }),
      };
    });

    const newLastID =
      jenPlatne.length > 0
        ? Math.max(...jenPlatne.map(item => item.uid))
        : lastID;

    await uploadFileOnS3(result, "hot-or-not-results/salat-stats.json");
    await uploadFileOnS3(
      { lastID: newLastID },
      "hot-or-not-results/salat-status.json"
    );

    await cloudfront.createInvalidation(params).promise();

    return "snad cajk " + jenPlatne.length + " nových";
  } catch (error) {
    console.log(error);
  }
};
