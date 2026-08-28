import 'dotenv/config';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function applyMigrations() {
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) throw new Error('Missing SUPABASE_DB_PASSWORD. Add it to .env.local before applying migrations.');
  const client = new Client({
    host: process.env.SUPABASE_DB_HOST || 'aws-0-ap-southeast-2.pooler.supabase.com',
    port: Number(process.env.SUPABASE_DB_PORT || 6543),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres.esiqaqzmgtfyzfhrfgna',
    password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully to apply migrations.');

    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
        console.log(`Successfully applied ${file}`);
      }
    }
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
    console.log('Disconnected.');
  }
}

applyMigrations();
