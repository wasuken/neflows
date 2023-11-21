import Parser from "rss-parser";
const parser = new Parser();

// キャッシング、期限(ttl)つき
export default class RequestCache<T, U> {
  constructor(ttl: number) {
    this.cache = new Map<T, U>();
    this.ttl = ttl;
  }
  // よびだすのはこいつだけ
  async request(url: T) {
    console.log(this.cache);
    if (this.cache.has(url)) {
      return this.get(url);
    } else {
      const value = await this.generateRSSList(url);
      this.set(url, value);
      return value;
    }
  }

  private set(key: T, value: U) {
    const expire = Date.now() + this.ttl;
    this.cache.set(key, { value, expire });
    setTimeout(() => this.cache.delete(key), this.ttl);
  }

  private get(key: T) {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expire) {
      return item.value;
    }
    return null;
  }
  private async generateRSSList(url: T) {
    const feed = await parser.parseURL(url);
    let rst: Article[] = [];
    // console.log(feed.items[0]);
    feed.items.forEach((item) => {
      const article: Article = {
        title: item.title,
        description: item.contentSnippet ?? "",
        link: item.link,
      };
      rst.push(article);
    });
    return rst;
  }
}
