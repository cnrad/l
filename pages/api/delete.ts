import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../src/util/redis";

type Data = {
    success?: boolean;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.body.auth == process.env.URL_PASSWORD) {
        let shortened = req.body.code;

        await redis.hdel("stats", shortened);
        await redis.hdel("links", shortened);

        return res.status(200).json({ success: true });
    } else return res.status(400).json({ error: "Invalid auth!" });
}
