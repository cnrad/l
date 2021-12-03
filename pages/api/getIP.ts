import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    ip: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let ipAddr = (req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown") as string;

    return res.status(200).json({ ip: ipAddr });
}
