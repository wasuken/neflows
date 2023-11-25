import RSSRequestCache from "../../src/lib/RSSRequestCache";
import RSSParserWrapper from "../../src/lib/RSSParserWrapper";
import { Article } from "../../src/const";

import { createServer } from "http";
import fs from "fs";

describe("RSSRequestCache", () => {
  const ttl = 1000; // 1秒後に期限切れになるように設定
  it("should use the RSSParserWrapper to fetch data", async () => {
    const expected = {
      items: [
        {
          title: "test",
          contentSnippet: "test desc",
          link: "http://example.com",
        },
      ],
    };
    const mockRSSParser = new RSSParserWrapper();
    mockRSSParser.parseURL = jest.fn().mockResolvedValue(expected);

    const cache = new RSSRequestCache(1000, mockRSSParser);
    const url = "http://example.com";
    const data = await cache.request(url);

    expect(data).toEqual([
      {
        title: "test",
        description: "test desc",
        link: "http://example.com",
      },
    ]);
  });
});
