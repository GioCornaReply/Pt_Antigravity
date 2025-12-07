import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createTables } from '@/lib/db';

export async function GET(request: Request) {
    try {
        await createTables();
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');

        if (!dateStr) {
            return NextResponse.json({ error: 'Date required' }, { status: 400 });
        }

        // Check DB
        const { rows } = await sql`
      SELECT * FROM workout_plans WHERE date = ${dateStr}::date LIMIT 1
    `;

        if (rows.length > 0) {
            return NextResponse.json({
                muscle: rows[0].muscle_group,
                exercises: rows[0].exercises
            });
        }

        // Dynamic Generation (Cyclic Logic)
        const dt = new Date(dateStr);
        const refDate = new Date('2024-01-01');
        const diffTime = Math.abs(dt.getTime() - refDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const cycleIndex = diffDays % 4;

        let plan = { muscle: 'Riposo', exercises: [] };

        if (cycleIndex === 0) {
            plan = {
                muscle: "Petto",
                exercises: [
                    { name: "Panca Piana", sets: "4x8", rest: "120s", notes: "Controllo" },
                    { name: "Croci Manubri", sets: "3x12", rest: "60s", notes: "Stretch" },
                    { name: "Spinte Inclinata", sets: "3x10", rest: "90s", notes: "Focus alto" }
                ]
            } as any;
        } else if (cycleIndex === 1) {
            plan = {
                muscle: "Schiena",
                exercises: [
                    { name: "Lat Machine", sets: "4x10", rest: "90s", notes: "Gomiti bassi" },
                    { name: "Pulley", sets: "3x12", rest: "60s", notes: "Allunga bene" },
                    { name: "Rematore", sets: "4x8", rest: "120s", notes: "Schiena dritta" }
                ]
            } as any;
        } else if (cycleIndex === 2) {
            plan = {
                muscle: "Gambe",
                exercises: [
                    { name: "Squat", sets: "4x8", rest: "120s", notes: "Deep" },
                    { name: "Leg Press", sets: "3x12", rest: "90s", notes: "Push" },
                    { name: "Leg Extension", sets: "3x15", rest: "60s", notes: "Burn" }
                ]
            } as any;
        }

        return NextResponse.json(plan);

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
