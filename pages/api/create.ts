import type { NextApiRequest, NextApiResponse } from 'next'
import redis from "../../src/util/redis";
import random from "../../src/util/random";

type Data = {
    code?: string,
    error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    let shortened = await random(5);
    let newLink = new RegExp("^(http|https)://", "i").test(req.body.url)
                ? req.body.url
                : `https://${req.body.url}`;

    await redis.hset("links", shortened, newLink);

    return res.status(200).json({ code: shortened });
}
