import RSSRequestCache from "../../src/lib/RSSRequestCache";
import RSSParserWrapper from "../../src/lib/RSSParserWrapper";
import { Article } from "../../src/const";
import { setTimeout } from "timers/promises";

import { createServer } from "http";
import fs from "fs";

describe("RSSRequestCache", () => {
  const ttl = 1000; // 1秒後に期限切れになるように設定
  it("一件取得のみ", async () => {
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
  it("一件取得後、キャッシングできてるかまで確認", async () => {
    const beforeData = {
      items: [
        {
          title: "test",
          contentSnippet: "test desc",
          link: "http://example.com",
        },
      ],
    };
    const expected = {
      items: [
        {
          title: "test after",
          contentSnippet: "test desc after",
          link: "http://example.com/after",
        },
      ],
    };
    const mockRSSParser = new RSSParserWrapper();
    mockRSSParser.parseURL = jest.fn().mockResolvedValue(beforeData);

    const cache = new RSSRequestCache(1000, mockRSSParser);
    const url = "http://example.com/after";
    const data = await cache.request(url);

    mockRSSParser.parseURL = jest.fn().mockResolvedValue(expected);
    const data2 = await cache.request(url);

    // キャッシュから返却しているなら、あたらしいparseURLはつかわないはず。
    expect(data2).toEqual([
      {
        title: "test",
        description: "test desc",
        link: "http://example.com",
      },
    ]);
  });
  it("一件取得後、キャッシュ期限切れてきえた後にキャッシングしていないことを確認", async () => {
    const beforeData = {
      items: [
        {
          title: "test",
          contentSnippet: "test desc",
          link: "http://example.com",
        },
      ],
    };
    const expected = {
      items: [
        {
          title: "test after",
          contentSnippet: "test desc after",
          link: "http://example.com/after",
        },
      ],
    };
    const mockRSSParser = new RSSParserWrapper();
    mockRSSParser.parseURL = jest.fn().mockResolvedValue(beforeData);

    const cache = new RSSRequestCache(1000, mockRSSParser);
    const url = "http://example.com/after";
    const data = await cache.request(url);

    await setTimeout(1000);

    mockRSSParser.parseURL = jest.fn().mockResolvedValue(expected);
    const data2 = await cache.request(url);

    // キャッシュから返却していなければ、あたらしいデータのはず
    expect(data2).toEqual([
      {
        title: "test after",
        description: "test desc after",
        link: "http://example.com/after",
      },
    ]);
  });
});
