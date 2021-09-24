import redis from "../src/util/redis";
import styled from "styled-components";

export async function getServerSideProps(context: any) {
    const shortened = context.params.link;

    let response = await redis.hget("links", shortened);

    console.log(response);

    if (!response) {
        return {
            notFound: true,
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
    font-family: 'Ubuntu Mono', sans-serif;
    font-weight: 600;
    color: #3f3;
`;
