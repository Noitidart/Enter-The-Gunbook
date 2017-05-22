import { base64_encode } from './utils'

const USERNAME = '';
const PASSWORD = '';

export async function getToken() {
    const response = await fetch('https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/speech-to-text/api', {
        headers: {
            'Authorization': `Basic ${base64_encode(`${USERNAME}:${PASSWORD}`)}`,
            'Content-Type':'application/json'
        }
    });
    console.log('watson-stt::getToken - response:', response);

    if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Got bad response "status" (${response.status}) from Watson Token server, error: "${error}"`);
    }

    const token = await response.text();

    return token;
}

export async function getResults(audio, ext, token) {
    // audio - blob (web) or file path without file:// (react native)
    // ext - type of file like "ogg" (must lower case? i dont think so but thats all i see)

    const data = new FormData();
    if (typeof audio === 'string') {
        const file_path = audio;
        data.append('file', { uri:`file://${file_path}`, name:`recording.${ext}`, type:`audio/${ext}` }, `recording.${ext}`);
    } else {
        // assume blob
        const blob = audio;
        data.append('file', blob, `recording.${ext}`);
    }

    const response = await fetch('https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?continuous=true', {
        method: 'POST',
        headers: {
            // 'Content-Type': `audio/${ext}`,
            'Content-Type': 'multipart/form-data',
            'X-Watson-Authorization-Token': token
        },
        body: data
    });

    console.log('watson-stt::getResults - response:', response);

    if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Got bad response "status" (${response.status}) from Watson Speach to Text server, error: "${error}"`);
    }

    return await response.json();
}