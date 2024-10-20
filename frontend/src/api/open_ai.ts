import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY; // .envから取得
const apiUrl = 'https://api.openai.com/v1/chat/completions';

export async function askChatGPT(messages: Array<{role: string, content: string}>) {
    try {
        const response = await axios.post(apiUrl, {
            model: 'gpt-3.5-turbo', // または 'gpt-4'
            messages: messages,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}
