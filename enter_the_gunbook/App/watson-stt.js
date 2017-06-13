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


    if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Got bad response "status" (${response.status}) from Watson Token server, error: "${error}"`);
    }

    const token = await response.text();

    return token;
}

export async function getResults(audio, ext, content_type) {
    // audio - blob (web) or file path without file:// (react native)
    // ext - type of file like "ogg" (must lower case? i dont think so but thats all i see)


    const ismobile = typeof audio === 'string';

    const blob = ismobile ? undefined : audio;
    const file_path = ismobile ? audio : undefined;

    let token;
    if (!ismobile) {

        token = await getToken();
    }

    const body = new FormData();
    if (ismobile) {
        let metadata = {
            part_content_type: content_type
        };
        body.append('metadata', JSON.stringify(metadata));
        body.append('upload', { uri:`file://${file_path}`, name:`recording.${ext}`, type:`audio/${ext}` });
    } else {
        body.append('file', blob);
    }

    const headers = !ismobile ? { 'Content-Type':`audio/${ext}`, 'X-Watson-Authorization-Token':token } : { 'Authorization':`Basic ${base64_encode(`${USERNAME}:${PASSWORD}`)}` };

    const response = await fetch('https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?continuous=true', {
        method: 'POST',
        headers,
        body
    });



    if (response.status !== 200) {
        const error = await response.text();
        throw new Error(`Got bad response "status" (${response.status}) from Watson Speach to Text server, error: "${error}"`);
    }

    return await response.json();
}