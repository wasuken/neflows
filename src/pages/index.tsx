import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./index.module.css";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

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
  const [interv, setInterv] = useState<ReturnType<typeof setInterval> | null>(
    null
  );
  const loader = (
    <div className={styles.loader} key={0}>
      Loading ...
    </div>
  );
  const loadMore = async () => {
    const res = await fetch(`/api/articles`);
    const data = await res.json();

    if (data.length < 1) {
      setHasMore(false);
      return;
    }
    setArticles([...articles, ...data]);
  };
  const handlePauseButtonClick = () => {
    if (interv) {
      clearInterval(interv);
      setInterv(null);
    } else {
      const inv = setInterval(autoScroll, scrollInterval);
      setInterv(inv);
    }
  };

  useEffect(() => {
    const inv = setInterval(autoScroll, scrollInterval);
    setInterv(inv);

    return () => clearInterval(inv);
  }, []);
  return (
    <div className={styles.main}>
      <div className={styles.sidebar}>
        <h2>再生/停止</h2>
        <button className={styles.linkButton} onClick={handlePauseButtonClick}>
          {interv === null ? <FaPlayCircle /> : <FaPauseCircle />}
        </button>
      </div>
      <div className={styles.articleArea}>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loader={loader}>
          <div>
            {articles.map((article, index) => (
              <a
                href={article.link}
                className={styles.newsLink}
                target="_blank"
                key={index}
              >
                <div className={styles.newsItem}>
                  <h2 className={styles.newsTitle}>{article.title}</h2>
                  <p className={styles.newsDescription}>
                    {article.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
