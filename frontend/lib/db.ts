import { sql } from '@vercel/postgres';

export async function createTables() {
  try {
    // Users Table with Auth and Profile Image
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        name VARCHAR(255),
        goal VARCHAR(255),
        restrictions VARCHAR(255),
        frequency INTEGER,
        image_url TEXT
      );
    `;

    // Try to add columns if they don't exist (Migration for existing DB)
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url TEXT`;
    } catch (e) {
      // Ignore if columns exist or error
      console.log("Migration note: Columns might already exist");
    }

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
