import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OPENAI_API_KEY is missing");
            return NextResponse.json({ response: "Error: Server configuration missing (API Key)." }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const { message } = await request.json();

        const systemPrompt = `
      Sei un Personal Trainer AI esperto. Il tuo obiettivo è fornire schede di allenamento e consigli nutrizionali chiari e strutturati.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            max_tokens: 200,
        });

        const aiMessage = completion.choices[0].message.content;
        return NextResponse.json({ response: aiMessage });

    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({ response: `Error: ${error.message}` }, { status: 500 });
    }
}
