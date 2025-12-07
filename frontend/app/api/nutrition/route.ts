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
      SELECT * FROM nutrition_plans WHERE date = ${dateStr}::date LIMIT 1
    `;

        if (rows.length > 0) {
            return NextResponse.json({ meals: rows[0].meals });
        }

        // Dynamic Generation (Cyclic Logic)
        const dt = new Date(dateStr);
        const refDate = new Date('2024-01-01');
        const diffTime = Math.abs(dt.getTime() - refDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const cycleIndex = diffDays % 4;

        let plan = { meals: [] };

        if (cycleIndex === 0) { // High Carb
            plan = {
                meals: [
                    { name: "Colazione", items: ["Porridge d'avena (80g)", "Banana", "Proteine in polvere"] },
                    { name: "Pranzo", items: ["Riso Basmati (100g)", "Petto di pollo (150g)", "Zucchine"] },
                    { name: "Cena", items: ["Patate dolci (200g)", "Merluzzo (200g)", "Olio EVO"] }
                ]
            } as any;
        } else if (cycleIndex === 1) { // Low Carb
            plan = {
                meals: [
                    { name: "Colazione", items: ["Uova strapazzate (3)", "Avocado toast", "Caffè nero"] },
                    { name: "Pranzo", items: ["Insalatona mista", "Tonno al naturale (150g)", "Noci"] },
                    { name: "Cena", items: ["Salmone alla piastra (200g)", "Asparagi", "Olio EVO"] }
                ]
            } as any;
        } else if (cycleIndex === 2) { // Balanced
            plan = {
                meals: [
                    { name: "Colazione", items: ["Yogurt Greco (200g)", "Miele", "Frutti di bosco"] },
                    { name: "Pranzo", items: ["Pasta integrale (80g)", "Macinato magro (150g)", "Sugo"] },
                    { name: "Cena", items: ["Tacchino (150g)", "Verdure grigliate", "Pane integrale (50g)"] }
                ]
            } as any;
        } else { // Detox
            plan = {
                meals: [
                    { name: "Colazione", items: ["Smoothie verde", "Mela", "Mandorle"] },
                    { name: "Pranzo", items: ["Quinoa (80g)", "Ceci (100g)", "Pomodorini"] },
                    { name: "Cena", items: ["Vellutata di zucca", "Ricotta light (100g)", "Crostini"] }
                ]
            } as any;
        }

        return NextResponse.json(plan);

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
