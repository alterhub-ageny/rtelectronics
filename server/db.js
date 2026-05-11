import pkg from "pg";
const { Pool } = pkg;

const url = new URL(process.env.DATABASE_URL);
url.searchParams.delete("sslmode");

const pool = new Pool({
  connectionString: url.toString(),
  max: 10,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;
