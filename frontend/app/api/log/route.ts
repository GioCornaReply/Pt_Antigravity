import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Mock logging for now, or save to DB if needed later
        console.log("Log received:", body);

        return NextResponse.json({
            status: "success",
            analysis: `Ho registrato il tuo ${body.type}: '${body.content}'.`
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error logging' }, { status: 500 });
    }
}
