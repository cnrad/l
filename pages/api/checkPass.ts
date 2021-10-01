import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    success: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    let result = false;

    if (req.query["pass"] == process.env.URL_PASSWORD) result = true;
    console.log(req.query["pass"])

    return res.status(200).json({ success: result });
}
