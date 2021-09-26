import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

import createLink from "../src/commands/create";

const Home: NextPage = () => {
    const [cmdHistory, setCmdHistory]: any[] = useState([]);

    useEffect(() => {
        document.addEventListener("keypress", checkKey);
    }, [cmdHistory]);

    const checkKey = (event: KeyboardEvent): any => {
        if (event.key === "Enter") {
            document.removeEventListener("keypress", checkKey);
            handleCommand();
        }
    };

    const handleCommand = async () => {
        const command = (document.getElementById(`currentCommand`) as HTMLInputElement).value;

        await setCmdHistory([
            ...cmdHistory,
            {
                first: document.getElementById(`currentFirst`)!.innerText,
                input: command,
            },
        ]);

        executeCommand(command);

        return ((document.getElementById(`currentCommand`) as HTMLInputElement).value = "");
    };

    const executeCommand = async (cmd: string) => {
        let cmdArgs = cmd.split(" ");

        if (cmdArgs[0] === "create") await createLink(cmdArgs[1])
        if (cmdArgs[0] === "stats") await viewStats(cmdArgs[1])

    };

    async function createLink(link: string) {

        let data = await fetch("/api/create", {
            method: "POST",
            body: JSON.stringify({ url: link }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        navigator.clipboard.writeText(`https://l.cnrad.dev/${data.code}`);

        await setCmdHistory([
            ...cmdHistory,
            {
                first: `Copied Link --> https://l.cnrad.dev/${data.code}`,
                input: "",
            },
        ]);
    }

    async function viewStats(code: string) {

        let data = await fetch("/api/log", {
            method: "POST",
            body: JSON.stringify({ code: code }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        await setCmdHistory([
            ...cmdHistory,
            {
                first: `Copied Link --> https://l.cnrad.dev/${data.code}`,
                input: "",
            },
        ]);
    }

    return (
        <Page>
            {cmdHistory.map((element: any, index: number) => {
                return (
                    <CommandLine key={`command${index}`}>
                        <First id={`first${index}`}>{cmdHistory[index].first}</First>
                        <PrevInput id={`input${index}`}>{cmdHistory[index].input}</PrevInput>
                    </CommandLine>
                );
            })}

            <CommandLine>
                <First id="currentFirst">{"cnrad/projects/l.cnrad.dev>"}</First>
                <Input id="currentCommand" />
            </CommandLine>
        </Page>
    );
};

const Page = styled.div`
    background: #000;
    color: #3f3;

    position: absolute;
    width: 100%;
    height: 100vh;
    padding: 1rem;

    overflow-y: scroll;
`;

const CommandLine = styled.div`
    background: #000;
    color: inherit;
    letter-spacing: 0.02rem;
    font-family: "Ubuntu Mono";
    font-size: 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;

    width: 100%;
    height: 2rem;
`;

const First = styled.div`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: "Ubuntu Mono";
    font-size: 1rem;

    width: auto;
    height: 2rem;
    line-height: 2rem;
`;

const Input = styled.input`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: "Ubuntu Mono";
    font-size: 1rem;

    min-width: 60rem;
    height: 2rem;
    margin-left: 1rem;
`;

const PrevInput = styled.div`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: "Ubuntu Mono";
    font-size: 1rem;
    line-height: 2rem;

    max-width: 60rem;
    height: 2rem;
    margin-left: 1rem;
`;

export default Home;
