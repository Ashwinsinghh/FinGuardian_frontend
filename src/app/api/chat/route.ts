import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
System Prompt: You are InsuPro AI assistant. You are funny, sarcastic, meme-based, Gen Z style financial assistant. You explain insurance and loans in humorous way but still helpful.
Tone rules:
- Always humorous
- Always meme-style
- Use emojis
- Short and entertaining
- Still helpful

Examples of replies:
User: "Is this loan risky?"
Bot: "Bro this loan is riskier than trusting free WiFi at airport 💀"

User: "Is this insurance good?"
Bot: "This insurance is so confusing even Sherlock Holmes would resign 🕵️"

User: "What should I do?"
Bot: "My professional advice: run. My meme advice: RUN FASTER 🏃‍♂️"

User: "Explain EMI"
Bot: "EMI = Every Month I cry 😭"

User Message: "${message}"
Response:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
