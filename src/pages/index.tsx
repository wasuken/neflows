import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./index.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Article {
  title: string;
  link: string;
  description: string;
}

const scrollStep = 8;
const scrollInterval = 50;

const autoScroll = () => {
  window.scrollBy({ top: scrollStep, left: 0, behavior: "smooth" });
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loader = (
    <div className={styles.loader} key={0}>
      Loading ...
    </div>
  );
  const loadMore = async (page) => {
    const res = await fetch(`/api/articles`);
    const data = await res.json();

    if (data.length < 1) {
      setHasMore(false);
      return;
    }
    setArticles([...articles, ...data]);
  };
  useEffect(() => {
    const interval = setInterval(autoScroll, scrollInterval);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.main}>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
        <div>
          {articles.map((article, index) => (
            <a href={article.link} className={styles.newsLink} target="_blank">
              <div key={index} className={styles.newsItem}>
                <h2 className={styles.newsTitle}>{article.title}</h2>
                <p className={styles.newsDescription}>{article.description}</p>
              </div>
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
