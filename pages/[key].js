import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import RelatedArticles from "../components/RelatedArticles";
import ResultsPanel from "../components/ResultsPanel";
import styles from "../styles/Home.module.css";

const DetailsPage = props => {
  useEffect(() => {
    const url =
      "https://datarozhlas.s3.eu-central-1.amazonaws.com/hot-or-not-results/salat-stats.json";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setResults(data);
      });
  }, []);

  const router = useRouter();
  const key = router.query.key;
  const candidateDetails = props.data.find(i => i.key === key);
  let candidateResults;

  const [results, setResults] = useState([]);

  if (results.length > 0) {
    candidateResults = results.find(i => i.id === candidateDetails.id);
  }

  return (
    <>
      <Head>
        <title>
          {`Průběžné výsledky ${candidateDetails.genitiv} v rozstřelu bramborových salátů`}
        </title>
        <meta
          key="share-image"
          property="og:image"
          content="https://www.irozhlas.cz/sites/default/files/styles/zpravy_facebook/public/uploader/screen_shot_2022-12-_221213-141303_pek.png?itok=spfC2SIE"
        />
        <meta
          property="og:title"
          content={`Průběžné výsledky ${candidateDetails.genitiv} v rozstřelu bramborových salátů`}
        />
        <meta
          property="og:url"
          content="https://data.irozhlas.cz/salat-or-not/"
        />
        <meta
          property="og:description"
          content={
            "Pobavte se interaktivním rozstřelem základních i obskurních ingrediencí do vánočního salátu. Anonymní data vyhodnotíme v objevných žebříčcích."
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@irozhlascz" />
        <meta name="twitter:creator" content="@datarozhlas" />
        <meta
          name="twitter:title"
          content={`Průběžné výsledky ${candidateDetails.genitiv} v rozstřelu bramborových salátů`}
        />
        <meta
          name="twitter:image"
          content="https://www.irozhlas.cz/sites/default/files/styles/zpravy_twitter/public/uploader/screen_shot_2022-12-_221213-141303_pek.png?itok=POguUL9s"
        />
        <meta
          name="twitter:description"
          content="Pobavte se interaktivním rozstřelem základních i obskurních ingrediencí do vánočního salátu. Anonymní data vyhodnotíme v objevných žebříčcích."
        />
      </Head>
      {candidateDetails && results.length > 0 && (
        <div className={styles.container}>
          <Header text={candidateDetails.name}></Header>
          <h3 className={styles.subtitleDetail}>{`${Math.round(
            (candidateResults.w / (candidateResults.w + candidateResults.l)) *
              100
          )} % vítězství z ${(
            candidateResults.w + candidateResults.l
          ).toLocaleString("cs-CZ")} duelů`}</h3>
          <div className={styles.candidateProfileContainer}>
            <Image
              className={styles.image}
              src={`https://data.irozhlas.cz/salat-or-not/img/${candidateDetails.key}-300.png`}
              alt={candidateDetails.name}
              width={200}
              height={200}
            ></Image>
          </div>
          <div className={styles.buttonContainer}>
            <Link href="/vysledky">
              <button className={styles.button}>
                Zpět na celkové výsledky
              </button>
            </Link>
          </div>
          <div className={styles.resultsContainer}>
            <h3 className={styles.subtitle}>
              {candidateDetails.dativ.charAt(0).toUpperCase() +
                candidateDetails.dativ.slice(1)}{" "}
              se nejvíc daří proti
            </h3>
            <ResultsPanel
              results={candidateResults.c}
              dativ={true}
              data={props.data}
            ></ResultsPanel>
          </div>
          <RelatedArticles tag={85699} name={"Vánocích"}></RelatedArticles>
        </div>
      )}
    </>
  );
};

export async function getStaticPaths() {
  const data = await fetch(
    "https://data.irozhlas.cz/hot-or-not-data/salaty.json"
  ).then(res => res.json());

  return {
    paths: data.filter(item => item.use).map(i => ({ params: { key: i.key } })),
    fallback: false,
  };
}

export async function getStaticProps() {
  const data = await fetch(
    "https://data.irozhlas.cz/hot-or-not-data/salaty.json"
  ).then(res => res.json());
  return {
    props: {
      data: data.filter(item => item.use),
    },
  };
}

export default DetailsPage;
