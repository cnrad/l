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

    let shortened = req.body.code;

    let stats: string = await redis.hget("stats", shortened) as string;

    stats = await JSON.parse(stats);

    return res.status(200).json({ code: stats });
}
