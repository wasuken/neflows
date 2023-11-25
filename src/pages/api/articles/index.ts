import type { NextApiRequest, NextApiResponse } from "next";
import { Article, shuffle, urlMap } from "@/const";
import RSSRequestCache from "@/lib/RSSRequestCache";
import RSSParserWrapper from "@/lib/RSSParserWrapper";

const reqCache = new RSSRequestCache(1000 * 60 * 10, new RSSParserWrapper());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const list = shuffle([...urlMap.google, ...urlMap.yahoo]);
    const url = list[0];
    return res.status(200).json(await reqCache.request(url));
  }
}
