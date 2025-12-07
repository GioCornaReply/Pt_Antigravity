import { sql } from '@vercel/postgres';

export async function createTables() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        goal VARCHAR(255),
        restrictions VARCHAR(255),
        frequency INTEGER
      );
    `;
        await sql`
      CREATE TABLE IF NOT EXISTS workout_plans (
        id SERIAL PRIMARY KEY,
        date DATE,
        muscle_group VARCHAR(255),
        exercises JSONB
      );
    `;
        await sql`
      CREATE TABLE IF NOT EXISTS nutrition_plans (
        id SERIAL PRIMARY KEY,
        date DATE,
        meals JSONB
      );
    `;
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}
