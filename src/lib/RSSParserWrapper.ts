import Parser from "rss-parser";

export default class RSSParserWrapper {
  parser: Parser;
  constructor() {
    this.parser = new Parser();
  }
  async parseURL(url: string) {
    // rss-parserの機能をラップ
    return this.parser.parseURL(url);
  }
  parseString(string: string) {
    // 必要に応じて実装
    return this.parser.parseString(string);
  }
}
