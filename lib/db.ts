import postgres from 'postgres';

const sql = postgres({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  username: 'postgres.lkasfkmxzgngqwmtzjbw',
  password: process.env.SUPABASE_DB_PASSWORD ?? '',
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERTIFICATE,
  },
});

export default sql;
