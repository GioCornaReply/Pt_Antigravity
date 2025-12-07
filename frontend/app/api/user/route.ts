import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createTables } from '@/lib/db';

export async function GET() {
    try {
        // Ensure tables exist (lazy initialization)
        await createTables();

        const { rows } = await sql`SELECT * FROM users LIMIT 1`;

        if (rows.length === 0) {
            return NextResponse.json(null);
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await createTables();
        const body = await request.json();
        const { name, goal, restrictions, frequency } = body;

        // Check if user exists
        const { rows } = await sql`SELECT * FROM users LIMIT 1`;

        if (rows.length > 0) {
            // Update
            const user = await sql`
        UPDATE users 
        SET name = ${name}, goal = ${goal}, restrictions = ${restrictions}, frequency = ${frequency}
        WHERE id = ${rows[0].id}
        RETURNING *
      `;
            return NextResponse.json(user.rows[0]);
        } else {
            // Create
            const user = await sql`
        INSERT INTO users (name, goal, restrictions, frequency)
        VALUES (${name}, ${goal}, ${restrictions}, ${frequency})
        RETURNING *
      `;
            return NextResponse.json(user.rows[0]);
        }
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
