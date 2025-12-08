import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createTables } from '@/lib/db';

export async function POST(request: Request) {
    try {
        await createTables();
        const body = await request.json();
        const { action, email, password, name, goal, restrictions, frequency, image_url } = body;

        if (action === 'register') {
            // Check if user exists
            const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
            if (existing.rows.length > 0) {
                return NextResponse.json({ error: 'Email già registrata' }, { status: 400 });
            }

            // Create User
            const user = await sql`
        INSERT INTO users (email, password, name, goal, restrictions, frequency, image_url)
        VALUES (${email}, ${password}, ${name || 'Utente'}, ${goal}, ${restrictions}, ${frequency || 0}, ${image_url})
        RETURNING *
      `;
            return NextResponse.json(user.rows[0]);
        }

        if (action === 'login') {
            const user = await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
            if (user.rows.length === 0) {
                return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
            }
            return NextResponse.json(user.rows[0]);
        }

        if (action === 'update') {
            const { id } = body;
            const user = await sql`
        UPDATE users 
        SET name = ${name}, goal = ${goal}, restrictions = ${restrictions}, frequency = ${frequency}, image_url = ${image_url}, email = ${email}, password = ${password}
        WHERE id = ${id}
        RETURNING *
      `;
            return NextResponse.json(user.rows[0]);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Simple get user by ID (passed as query param for simplicity in this prototype)
    // In a real app, use Session/Cookies
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json(null);

    try {
        const user = await sql`SELECT * FROM users WHERE id = ${id}`;
        return NextResponse.json(user.rows[0] || null);
    } catch (error) {
        return NextResponse.json(null);
    }
}
