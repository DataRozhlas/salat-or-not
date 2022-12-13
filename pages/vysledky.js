import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import ResultsPanel from "../components/ResultsPanel";
import RelatedArticles from "../components/RelatedArticles";
import Link from "next/link";
import Head from "next/head";

export default function Vysledky(props) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const url =
      "https://datarozhlas.s3.eu-central-1.amazonaws.com/hot-or-not-results/salat-stats.json";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setResults(data);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Nejoblíbenější ingredience do bramborového salátu</title>
        <meta
          key="share-image"
          property="og:image"
          content="https://www.irozhlas.cz/sites/default/files/styles/zpravy_facebook/public/uploader/screen_shot_2022-12-_221213-141303_pek.png?itok=spfC2SIE"
        />
        <meta
          property="og:title"
          content="Bramborový salát se syrečky, nebo radši s avokádem? Pomozte najít přísady, které nás spojují a rozdělují"
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
          content="Bramborový salát se syrečky, nebo radši s avokádem? Pomozte najít přísady, které nás spojují a rozdělují"
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

      <div className={styles.container}>
        <Header text="Nejoblíbenější ingredience do bramborového salátu"></Header>
        <div className={styles.buttonContainer}>
          <Link href="/">
            <button className={styles.button}>Zpět k hlasování</button>
          </Link>
        </div>
        <h3 className={`${styles.subtitle} ${styles.moveup}`}>
          Kliknutím na přísadu zobrazíte podrobnosti
        </h3>
        <ResultsPanel
          results={results}
          dativ={false}
          data={props.data}
        ></ResultsPanel>
        <RelatedArticles tag={85699} name={"Vánocích"}></RelatedArticles>
      </div>
    </>
  );
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
