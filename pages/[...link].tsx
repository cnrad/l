import redis from "../src/util/redis";
import styled from "styled-components";

export async function getServerSideProps(context: any) {
    const shortened = context.params.link;

    let response = await redis.hget("links", shortened);

    let IP = await fetch("http://l.cnrad.dev/api/getIP")
        .then(res => res.json())
        .then(data => data.ip);
    let UA = context.req.headers["user-agent"];
    let DATE = new Date().toString();

    await fetch("http://l.cnrad.dev/api/log", {
        method: "POST",
        body: JSON.stringify({
            ip: IP,
            userAgent: UA,
            date: DATE,
            code: shortened,
        }),
    });

    if (!response || response == null) {
        return {
            redirect: {
                destination: "https://l.cnrad.dev",
                permanent: true,
            },
        };
    }

    return {
        redirect: {
            destination: response,
            permanent: true,
        },
    };
}

export default function Home({ error, message }: any) {
    return (
        <Main>
            <Message>Redirecting shortly...</Message>
        </Main>
    );
}

const Main = styled.div`
    overflow: none;
    width: 100%;
    height: 100vh;
    background: #000;

    display: flex;
    align-items: center;
    justify-content: center;
`;

const Message = styled.div`
    font-size: 20px;
    font-family: "Ubuntu Mono", sans-serif;
    font-weight: 600;
    color: #3f3;
`;
