import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../src/util/redis";

type Data = {
    code?: string;
    stats?: string;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.body.auth == process.env.URL_PASSWORD) {
        let shortened = req.body.code;

        let stats: string = (await redis.hget("stats", shortened)) as string;
        stats = await JSON.parse(stats);

        console.log(stats);

        return res.status(200).json({ code: shortened, stats: stats });
    } else return res.status(400).json({ error: "Invalid auth!" });
}
