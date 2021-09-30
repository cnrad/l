import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../src/util/redis';

interface DataProps {
    ip: string,
    userAgent: string,
    date: string,
    code: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let data: DataProps = JSON.parse(req.body);

    console.log(data)

    let shortened = data.code;

    let object = JSON.stringify({
        userAgent: data.userAgent,
        ip: data.ip,
        date: data.date
    })

    await redis.hset("stats", shortened, object);

    return res.status(200);
}