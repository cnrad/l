import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    ip: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    let ipAddr = req.headers["x-real-ip"] as string;

    return res.status(200).json({ ip: ipAddr });
}
