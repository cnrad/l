type DataProps = {
    shortenedLink?: string,
    error?: string
}

export default async function createLink(link: string, document: Document) {

    let reqBody = JSON.stringify({url: link})

    let data = await fetch('/api/create', {
        method: 'POST',
        body: reqBody
    });

    return data;
    
}