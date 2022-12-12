import React from "react";
import styles from "../styles/ResultsItem.module.css";
import Image from "next/image";
import Link from "next/link";

const ResultsItem = props => {
  return (
    <Link href={`/${props.candidate.key}`}>
      <div className={styles.container}>
        <Image
          className={styles.image}
          src={`https://data.irozhlas.cz/salat-or-not/img/${props.candidate.key}-75.png`}
          alt={props.candidate.name}
          width={75}
          height={75}
        ></Image>
        <div className={styles.textbox}>
          <p className={styles.note}>
            <strong>
              {`${props.index}. ${
                props.dativ ? props.candidate.dativ : props.candidate.name
              }`}{" "}
            </strong>
          </p>
          <p className={styles.note}>{`${
            props.dativ
              ? 100 - props.candidateResults.pct
              : props.candidateResults.pct
          } % vítězství z  ${(
            props.candidateResults.w + props.candidateResults.l
          ).toLocaleString("cs-CZ")} duelů`}</p>
        </div>
      </div>
    </Link>
  );
};

export default ResultsItem;
