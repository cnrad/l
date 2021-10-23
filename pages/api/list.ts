import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../src/util/redis";
import random from "../../src/util/random";

type Data = {
    links?: string;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.body.auth == process.env.URL_PASSWORD) {
        let links: Record<any, any> = await redis.hgetall("links");

        return res.status(200).json({ links: JSON.stringify(links) });
    } else return res.status(400).json({ error: "Invalid auth!" });
}
