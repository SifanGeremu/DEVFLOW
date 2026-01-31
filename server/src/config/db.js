import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,    
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful.");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

checkConnection();
export default pool;
