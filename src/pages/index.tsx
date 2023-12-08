import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./index.module.css";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";

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
  const [query, setQuery] = useState<string>("");
  const [interv, setInterv] = useState<ReturnType<typeof setInterval> | null>(
    null
  );
  const loader = (
    <div className={styles.loader} key={0}>
      Loading ...
    </div>
  );
  const fetchSearchResult = async () => {
    // queryのみ
    const params = query && query.length > 0 ? `?query=${query}` : "";
    const url = `/api/articles${params}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.length < 1) {
      setHasMore(false);
      return;
    }
    setArticles([...data]);
  };
  const loadMore = async () => {
    await fetchSearchResult();
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
  const handleSearchClick = async () => {
    await fetchSearchResult();
    setHasMore(true);
  };

  useEffect(() => {
    const inv = setInterval(autoScroll, scrollInterval);
    setInterv(inv);

    return () => clearInterval(inv);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.sidebar}>
        <h2>操作</h2>
        <div>
          <h3>再生/停止</h3>
          <button
            className={styles.linkButton}
            onClick={handlePauseButtonClick}
          >
            {interv === null ? <FaPlayCircle /> : <FaPauseCircle />}
          </button>
        </div>
        <div>
          <h3>検索</h3>
          <input
            className={styles.searchText}
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
          <Button variant="primary" onClick={handleSearchClick}>
            Search
          </Button>
        </div>
      </div>
      <div className={styles.articleArea}>
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          loader={loader}
          pageStart={0}
        >
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
