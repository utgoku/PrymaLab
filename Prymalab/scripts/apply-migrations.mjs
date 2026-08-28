import 'dotenv/config';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

const password = process.env.SUPABASE_DB_PASSWORD;
if (!password) {
  throw new Error('Missing SUPABASE_DB_PASSWORD. Add it to .env.local before applying migrations.');
}

const client = new Client({
  host: process.env.SUPABASE_DB_HOST || 'aws-0-ap-southeast-2.pooler.supabase.com',
  port: Number(process.env.SUPABASE_DB_PORT || 6543),
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres.esiqaqzmgtfyzfhrfgna',
  password,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const directory = path.join(process.cwd(), 'supabase', 'migrations');
  const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
  for (const file of files) {
    console.log(`Applying ${file}`);
    await client.query(await readFile(path.join(directory, file), 'utf8'));
  }
  console.log(`Applied ${files.length} migration files.`);
} finally {
  await client.end();
}
