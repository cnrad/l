import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../src/util/redis';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if(!req.query["link"]) return res.status(500).json({error: true})
    let shortened = req.query["link"];

    let userIp = await fetch("http://api.ipify.org/?format=json");

    let object = JSON.stringify({
        "user-agent": "test",
        "ip": userIp,
        "date": new Date().toString()
    })

    await redis.hset("data", shortened, object);

    return res.status(200);
}