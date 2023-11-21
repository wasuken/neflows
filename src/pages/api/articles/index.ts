import type { NextApiRequest, NextApiResponse } from "next";
import { Article, shuffle, urlMap } from "@/const";
import RequestCache from "@/lib/RequestCache";

let reqCache = new RequestCache<string, Article[]>(1000 * 60 * 10);

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
