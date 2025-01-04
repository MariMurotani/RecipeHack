import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3.2:1b";

export async function fetchOllamaResponse(question: string) {
    const requestPayload = {
        model: MODEL_NAME,
        prompt: question, // サーバーに送信する質問
    };

    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
    });

    if (!response.body) {
        throw new Error('Stream response not supported or empty.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const json_result = JSON.parse(decoder.decode(value, { stream: true }));
        result += json_result.response;
        //console.log('Partial response:', decoder.decode(value, { stream: true }));
    }

    return result;
}

