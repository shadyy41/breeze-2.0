import postgres from 'postgres';

const sql = postgres({
  host: 'db.lkasfkmxzgngqwmtzjbw.supabase.co',
  port: 6543,
  database: 'postgres',
  username: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD ?? '',
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERTIFICATE,
  },
});

export default sql;
