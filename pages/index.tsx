import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Head from "next/head";
import MainPanel from "../components/MainPanel";
import HistoryPanel from "../components/HistoryPanel";
import RelatedArticles from "../components/RelatedArticles";
import styles from "../styles/Home.module.css";

export default function Home(props: { data: [] }) {
  // const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   const url = "https://data.irozhlas.cz/hot-or-not-data/prez.json";
  //   fetch(url)
  //     .then(res => res.json())
  //     .then(data => {
  //       setData(data);
  //     });
  // }, []);

  useEffect(() => {
    const url =
      "https://datarozhlas.s3.eu-central-1.amazonaws.com/hot-or-not-results/salat-stats.json";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setResults(data);
      });
  }, []);

  const greyStyle =
    history.length < 4 ? `grey${(history.length + 1) * 20}` : "grey100";

  return (
    <>
      <Head>
        <title>Co patří do vánočního bramborového salátu?</title>
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
      {props.data.length > 0 && (
        <div className={styles.container}>
          <Header text="Co patří do vánočního bramborového salátu?"></Header>
          <h3 className={styles.subtitle}>
            {history.length > 0
              ? `Vyberte další ingredienci`
              : "Klikněte na jednu z ingrediencí"}
          </h3>
          <MainPanel
            data={props.data}
            history={history}
            setHistory={setHistory}
          ></MainPanel>
          <HistoryPanel
            data={props.data}
            history={history}
            results={results}
          ></HistoryPanel>
          <div className={styles.buttonContainer}>
            <Link href="/vysledky">
              <button className={`${styles.button} ${styles[greyStyle]}`}>
                Zobrazit výsledky hlasování<br></br>
                <span className={styles.buttonSmall}>
                  čtenářů a čtenářek iROZHLAS.cz
                </span>
              </button>
            </Link>
          </div>
          <div className={styles.text}>
            <p>
              Z různých receptů na bramborový salát jsme vybrali 43 přísad.
              Některé jsou těžko nahraditelné, typicky brambory. Některé jsou
              dlouhodobě kontroverzní, například měkký či tvrdý salám. A některé
              leží za hranicí společenských konvencí, třeba tvarůžky nebo
              avokádo.
            </p>
            <p>
              V přímém souboji 1:1 můžete do omrzení vybírat, co se vám v
              chutném nebo alespoň poživatelném bramborovém salátu představuje
              snáze. Redakce serveru iROZHLAS.cz výsledky všech duelů
              zaznamenává. Vyhodnotí je a výsledný žebříček zveřejní ještě před
              Štědrým dnem, aby šlo data využít k racionální argumentaci při
              svátečních setkáních.
            </p>
            <p>
              Ilustrace přísad jsme vytvořili v AI generátoru Stable Diffusion
              na základě zadání zmiňujících „československý grafický design“,
              což dává většině obrázků kýžený mírně pelíškovský vibe. Při tomto
              průzkumu bojem vyšlo najevo, že nástroj natrénovaný na globálním
              datasetu není vhodný pro vizualizaci lokálních specialit; omluvte
              proto nedůvěryhodnou podobu salámu Junior, olomouckých syrečků a
              celerové bulvy. Ve všech případech jsme se k alespoň přibližné
              podobě museli dostat složitým opisem.
            </p>
          </div>
          <RelatedArticles tag={85699} name={"Vánocích"}></RelatedArticles>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const data = await fetch(
    "https://data.irozhlas.cz/hot-or-not-data/salaty.json"
  ).then(res => res.json());
  return {
    props: {
      data: data.filter((item: { use: boolean }) => item.use),
    },
  };
}
