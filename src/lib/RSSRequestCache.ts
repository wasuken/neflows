import RSSParserWrapper from "rss-parser";
import Parser from "rss-parser";
import { Article } from "@/const";

interface CacheValue {
  value: Article[];
  expire: number;
}

// キャッシング、期限(ttl)つき
export default class RSSRequestCache {
  cache: Map<string, CacheValue>;
  ttl: number;
  parser: RSSParserWrapper;
  constructor(ttl: number, rssParser: RSSParserWrapper) {
    this.cache = new Map<string, CacheValue>();
    this.ttl = ttl;
    this.parser = rssParser;
  }
  // よびだすのはこいつだけ
  async request(url: string) {
    console.log("debug", this.cache.keys());
    if (this.cache.has(url)) {
      console.log("debug", "use cache");
      return this.get(url);
    } else {
      const value: Article[] = await this.parseURLToArticleList(url);
      this.set(url, value);
      return value;
    }
  }
  private async parseURLToArticleList(url: string) {
    const feed = await this.parser.parseURL(url);
    let rst: Article[] = [];
    // console.log(feed.items[0]);
    feed.items.forEach((item) => {
      const article: Article = {
        title: item.title ?? "",
        description: item.contentSnippet ?? "",
        link: item.link ?? "",
      };
      rst.push(article);
    });
    return rst;
  }

  private set(key: string, value: Article[]) {
    const expire = Date.now() + this.ttl;
    this.cache.set(key, { value, expire });
    setTimeout(() => this.cache.delete(key), this.ttl);
  }

  private get(key: string) {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expire) {
      return item.value;
    }
    return null;
  }
}
