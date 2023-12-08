import type { NextApiRequest, NextApiResponse } from "next";
import { setInterval, setTimeout } from "timers/promises";

import { shuffle, urlMap } from "@/const";
import RSSRequestCache from "@/lib/RSSRequestCache";
import RSSParserWrapper from "@/lib/RSSParserWrapper";

const TTL = 1000 * 60 * 10;

const reqCache = new RSSRequestCache(TTL, new RSSParserWrapper());
loop().then(() => console.log("info", "generate caching"));

async function generateCaching(list: string[]) {
  for (const url of list) {
    await reqCache.request(url);
    await setTimeout(1000);
  }
}

async function loop() {
  const list = [...urlMap.google, ...urlMap.yahoo];
  // start first generate caching.
  await generateCaching(list);
  console.log("debug", "start loop");
  for await (const _ of setInterval(TTL)) {
    console.log("debug", "start create caching...");
    await generateCaching(list);
    console.log("debug", "finish create caching.");
  }
  console.log("debug", "finish loop");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query } = req.query;
    // 検索機能
    if (query) {
      return res.status(200).json(reqCache.search(query as string));
    } else {
      // ランダムRSS返却
      const list = shuffle([...urlMap.google, ...urlMap.yahoo]);
      const url = list[0];
      return res.status(200).json(await reqCache.request(url));
    }
  }
}
