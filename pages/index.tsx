import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Home: NextPage = () => {
    const [cmdHistory, setCmdHistory]: any[] = useState([]);
    const [auth, setAuth] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.addEventListener("keypress", checkKey);
        if (auth == true) (document.getElementById(`currentCommand`) as HTMLInputElement).value = "";
    }, [cmdHistory, auth]);

    useEffect(() => {
        (document.getElementById(`password`) as HTMLInputElement).focus();
    }, []);

    const checkKey = async (event: KeyboardEvent): Promise<any> => {
        if (event.key === "Enter") {
            document.removeEventListener("keypress", checkKey);

            if (auth == false) {
                let pass = (document.getElementById(`password`) as HTMLInputElement).value;

                let validPass = await fetch(`/api/checkPass?pass=${pass}`).then(res => res.json());

                if (validPass.success === false) {
                    (document.getElementById(`password`) as HTMLInputElement).value = "";
                    return document.addEventListener("keypress", checkKey);
                } else if (validPass.success === true) {
                    setPassword(pass);
                    setAuth(true);
                    (document.getElementById(`currentCommand`) as HTMLInputElement).focus();
                }
            }

            if (auth === true) return handleCommand();
        }
    };

    const handleCommand = async () => {
        const command = (document.getElementById(`currentCommand`) as HTMLInputElement).value;

        let result: any = await executeCommand(command);

        await setCmdHistory((cmdHistory: any) => [
            ...cmdHistory,
            {
                first: document.getElementById(`currentFirst`)!.innerText,
                input: command,
            },
            {
                first: result.first,
                input: result.input,
            },
        ]);

        return document.getElementById("currentCommand")!.scrollIntoView();
    };

    const executeCommand = async (cmd: string) => {
        let cmdArgs = cmd.split(" ");

        if (cmdArgs[0] === "create") return createLink(cmdArgs[1]);
        if (cmdArgs[0] === "stats") return viewStats(cmdArgs[1]);
        if (cmdArgs[0] === "ls") return listLinks();
        if (cmdArgs[0] === "delete" || cmdArgs[0] === "del") return deleteLink(cmdArgs[1]);

        return invalidCommand(cmdArgs[0]);
    };

    async function createLink(link: string) {
        let data = await fetch("/api/create", {
            method: "POST",
            body: JSON.stringify({ url: link, auth: password }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        if (data.error)
            return {
                first: `Invalid authentication!`,
                input: "",
            };

        navigator.clipboard.writeText(`https://l.cnrad.dev/${data.code}`);

        return {
            first: `Copied Link --> https://l.cnrad.dev/${data.code}`,
            input: "",
        };
    }

    async function viewStats(code: string) {
        let data = await fetch("/api/stats", {
            method: "POST",
            body: JSON.stringify({ code: code, auth: password }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        if (data.error)
            return {
                first: `Invalid authentication!`,
                input: "",
            };

        if (data.stats === null)
            return {
                first: "Invalid code, or nobody has used the link yet!",
                input: "",
            };

        return {
            first: JSON.stringify(data),
            input: "",
        };
    }

    async function listLinks() {
        let data = await fetch("/api/list", {
            method: "POST",
            body: JSON.stringify({ auth: password }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        if (data.error)
            return {
                first: `Invalid authentication!`,
                input: "",
            };

        if (data.links === null)
            return {
                first: "No links created!",
                input: "",
            };

        return {
            first: data.links,
            input: "",
        };
    }

    async function deleteLink(code: string) {
        let data = await fetch("/api/delete", {
            method: "POST",
            body: JSON.stringify({ code: code, auth: password }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json());

        if (data.error)
            return {
                first: `Invalid authentication!`,
                input: "",
            };

        if (data.success !== true)
            return {
                first: "Link or code does not exist!",
                input: "",
            };

        return {
            first: `Link ${code} deleted successfully.`,
            input: "",
        };
    }

    async function invalidCommand(command: string) {
        return {
            first: `"${command}" is not a valid command!`,
            input: "",
        };
    }

    return (
        <>
            <Head>
                <title>{"cnrad/projects/l>"}</title>
            </Head>
            <Page>
                {cmdHistory.map((element: any, index: number) => {
                    if (
                        (index > 0 && cmdHistory[index - 1].input.startsWith("ls ")) ||
                        (index > 0 && cmdHistory[index - 1].input === "ls")
                    ) {
                        let obj = JSON.parse(cmdHistory[index].first);

                        return (
                            <DataCont>
                                {Object.keys(obj).map((key: string) => {
                                    return (
                                        <>
                                            <DataLine>{`${key} || ${obj[key]}`}</DataLine>
                                        </>
                                    );
                                })}
                            </DataCont>
                        );
                    }

                    if (
                        index > 0 &&
                        cmdHistory[index].first.includes("userAgent") &&
                        cmdHistory[index - 1].input.includes("stats")
                    ) {
                        let obj = JSON.parse(cmdHistory[index].first);

                        return (
                            <DataCont>
                                {obj.stats.map((element: any, index: number) => {
                                    return (
                                        <>
                                            <DataLine>{`${index} || Visited on || . . . ${element["date"]}`}</DataLine>
                                            <DataLine>{`${index} || User Agent || . . . ${element["userAgent"]}`}</DataLine>
                                            <DataLine>{`${index} || IP Address || . . . ${element["ip"]}`}</DataLine>
                                            <br />
                                        </>
                                    );
                                })}
                            </DataCont>
                        );
                    }

                    return (
                        <CommandLine key={`command${index}`}>
                            <First id={`first${index}`}>{cmdHistory[index].first}</First>
                            <PrevInput id={`input${index}`}>{cmdHistory[index].input}</PrevInput>
                        </CommandLine>
                    );
                })}

                {auth ? (
                    <CommandLine>
                        <First id="currentFirst">{"cnrad/projects/l.cnrad.dev>"}</First>
                        <Input id="currentCommand" defaultValue="" />
                    </CommandLine>
                ) : (
                    <CommandLine>
                        <First id="currentFirst">{"password:"}</First>
                        <Input id="password" defaultValue="" type="password" />
                    </CommandLine>
                )}
            </Page>
        </>
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

const DataCont = styled.div`
    margin-top: 1rem;
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: "Ubuntu Mono";
    font-size: 1rem;

    width: auto;
    height: auto;
`;

const DataLine = styled.div`
    width: auto;
    height: auto;
    line-height: 1.25rem;
`;

export default Home;
