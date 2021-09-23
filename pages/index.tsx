import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';
import styled from 'styled-components';

const Home: NextPage = () => {

    useEffect(() => {
        window.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') return handleCommand()
        })
    })

    const handleCommand = () => {
        let commandText = (document.querySelector('#input') as HTMLInputElement).value;
        console.log(commandText)
    }

    return (
        <Page>
            <CommandLine> 
                {'cnrad/projects/l.cnrad.dev>'} 
                <Input id="input"></Input>
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

    width: auto;
    height: 2rem;
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

export default Home
