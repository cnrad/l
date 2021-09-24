import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Home: NextPage = () => {

    let [cmdHistory, setCmdHistory]: any[] = useState([]);
    let [command, setCommand] = useState("");

    useEffect(() => {
        window.addEventListener('keypress', checkKey);
    }, [cmdHistory])

    const checkKey = (event: any): any => {
        if (event.key === 'Enter') {
            window.removeEventListener('keypress', checkKey);
            handleCommand();
            window.addEventListener('keypress', checkKey);
        }
    }

    const handleCommand = () => {

        console.log(command);

        let firstText = document.getElementById(`currentFirst`)!.innerText;
        let commandText = command;
        (document.getElementById(`currentCommand`) as HTMLInputElement).value = "";

        setCmdHistory([...cmdHistory, {first: firstText, input: commandText}])

        return console.log(cmdHistory);

    }

    return (
        <Page>
            {cmdHistory.length > 0 ? cmdHistory.map((element: any, index: number) => {
                return (
                    <CommandLine key={`command${index}`}> 
                        <First id={`first${index}`}>{element.first}</First>
                        <PrevInput id={`input${index}`}>{element.input}</PrevInput>
                    </CommandLine>
                )
            }) : ''}

            <CommandLine> 
                <First id='currentFirst'>{'cnrad/projects/l.cnrad.dev>'}</First>
                <Input id='currentCommand' onChange={e => setCommand(e.target.value)} />
            </CommandLine>
        </Page>
    )
}

const Page = styled.div`
    background: #000;
    color: #3f3;

    position: absolute;
    width: 100%;
    height: 100vh;
    padding: 1rem;
`

const CommandLine = styled.div`
    background: #000;
    color: inherit;
    letter-spacing: 0.02rem;
    font-family: 'Ubuntu Mono';
    font-size: 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;

    width: 100%;
    height: 2rem;
`

const First = styled.div`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: 'Ubuntu Mono';
    font-size: 1rem;

    width: auto;
    height: 2rem;
    line-height: 2rem;
`

const Input = styled.input`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: 'Ubuntu Mono';
    font-size: 1rem;

    min-width: 60rem;
    height: 2rem;
    margin-left: 1rem;
`

const PrevInput = styled.div`
    background: #000;
    color: inherit;
    outline: none;
    border: none;
    letter-spacing: 0.02rem;
    font-family: 'Ubuntu Mono';
    font-size: 1rem;
    line-height: 2rem;

    max-width: 60rem;
    height: 2rem;
    margin-left: 1rem;
`

export default Home
