import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3.2:1b";

export async function fetchOllamaResponse(question: string, onPartialResponse: (partial: string) => void) {
    const requestPayload = {
        model: MODEL_NAME,
        prompt: question,
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

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const json_result = JSON.parse(decoder.decode(value, { stream: true }));
        onPartialResponse(json_result.response);
    }
}