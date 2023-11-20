import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

const parser = new Parser();

function generateTestResult() {
  return [...Array(30)].map((_, i) => {
    return {
      title: `test${i}`,
      link: "http://localhost",
      description: `${i}${i}${i}${i}${i}this is test.this is test.this is test.this is test.this is test.this is test.this is test.this is test.this is test.`,
    };
  });
}

async function generateStaticRSS() {
  const feed = await parser.parseURL(
    "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja"
  );
  let rst = [];
  feed.items.forEach((item) => {
    rst.push({
      title: item.title,
      description: item.contentSnippet,
      link: item.link,
    });
  });
  return rst;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json(await generateStaticRSS());
  }
}
