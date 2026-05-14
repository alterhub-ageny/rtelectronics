import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;
