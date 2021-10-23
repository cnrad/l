import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../src/util/redis";

interface DataProps {
    ip: string;
    userAgent: string;
    date: string;
    code: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    let data: DataProps = JSON.parse(req.body);

    let shortened = data.code;

    let value = (await redis.hget("stats", shortened)) as string;

    let prevArray: any[] = JSON.parse(value);

    !value ? (prevArray = []) : "";

    console.log(data);

    let object = {
        userAgent: data.userAgent,
        ip: data.ip,
        date: data.date,
    };

    prevArray.push(object);

    let newValue = JSON.stringify(prevArray);

    console.log(newValue);

    await redis.hset("stats", shortened, newValue);

    return res.status(200).json({ success: true });
};
