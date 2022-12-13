const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  let body;
  let statusCode = 200;
  // const headers = {
  //     "Content-Type": "application/json",
  //      "Access-Control-Allow-Headers" : "Content-Type",
  //        "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Methods": "POST"
  // };
  try {
    let requestJSON = JSON.parse(event.body);
    await dynamo
      .put({
        TableName: "salat-or-not",
        Item: {
          uid: Date.now() + Math.random(),
          appID: requestJSON.appID,
          winnerID: requestJSON.winnerID,
          url: requestJSON.url,
          ref: requestJSON.ref,
          loserID: requestJSON.loserID,
          draw: requestJSON.draw,
          ip: event.headers["x-forwarded-for"],
          client: event.headers["user-agent"],
        },
      })
      .promise();
    body = `Put item ${requestJSON.appID}`;
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  //     const eventHeaders = JSON.parse(event.headers);

  return event;
};
