const urlMap = {
  yahoo: [
    "https://news.yahoo.co.jp/rss/topics/top-picks.xml",
    "https://news.yahoo.co.jp/rss/topics/domestic.xml",
    "https://news.yahoo.co.jp/rss/topics/world.xml",
    "https://news.yahoo.co.jp/rss/topics/sports.xml",
  ],
  google: [
    "https://news.google.com/news/rss/headlines/section/topic/WORLD.ja_jp/%E5%9B%BD%E9%9A%9B?ned=jp&hl=ja&gl=JP",
    "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja",
  ],
};

function shuffle(arr: string[]) {
  let array = [...arr];
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

interface Article {
  title: string;
  link: string;
  description: string;
}

export { Article, shuffle, urlMap };
