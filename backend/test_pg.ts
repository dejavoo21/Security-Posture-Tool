import pg from 'pg';
import "dotenv/config";

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function test() {
    console.log('Testing connection to:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    try {
        await client.connect();
        console.log('Connected successfully to PostgreSQL!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        const tables = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        console.log('Tables in public schema:', tables.rows.map(r => r.tablename));
        await client.end();
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

test();
