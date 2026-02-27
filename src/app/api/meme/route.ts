import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { summary, risks, hiddenCharges, riskScore } = await req.json();

        if (riskScore === undefined) {
            return NextResponse.json({ error: 'Data is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
System Prompt: You are InsuPro AI Meme Analyst.
You react to insurance and loan reports in funny, chatpata, dramatic Indian meme style.
Your personality:
- sarcastic friend
- dramatic
- entertaining
- Hinglish allowed
- meme references allowed

Rules:
- 2 to 4 lines max
- use emojis
- use dramatic tone
- roast risky contracts
- praise safe contracts humorously
- make it entertaining

Report Data:
- Risk Score: ${riskScore}/100
- Summary: ${summary}
- Risks: ${risks}
- Hidden Charges: ${hiddenCharges}

Examples of replies:
High Risk:
"Yeh contract toh pura red flag ka showroom hai 🚩💀\nInterest rate dekh ke meri bhi EMI nikal gayi 😭\nMera professional advice: bhaagoooo 🏃‍♂️"

Medium Risk:
"Yeh deal thodi suspicious lag rahi hai 🤨\nMatlab toxic nahi but green bhi nahi 🥴\nThoda soch samajh ke sign karo boss"

Low Risk:
"Waah bhai waah 👏\nAaj pehli baar koi decent contract mila hai\nIsko frame karke wall pe laga lo 🖼️"

Now write a reaction for this report:
Response:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });
    } catch (error) {
        console.error('Meme API Error:', error);
        return NextResponse.json({ error: 'Failed to generate reaction' }, { status: 500 });
    }
}
