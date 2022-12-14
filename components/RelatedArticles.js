import React, { useEffect, useState } from "react";
import styles from "../styles/RelatedArticles.module.css";

const RelatedArticles = props => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const url = `https://www.irozhlas.cz/api/v2/tag/${props.tag}/articles`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setArticles(data.slice(0, 5));
      });
  }, [props.tag]);

  if (articles.length > 0)
    return (
      <div className={styles.container}>
        <h3>{`Poslední články o ${props.name ?? "prezidentské volbě"}`}</h3>
        <ul className={styles.list}>
          {articles.map(article => {
            return (
              <li key={article.id}>
                <a
                  href={`https://irozhlas.cz/node/${article.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {article.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  return <div></div>;
};

export default RelatedArticles;
