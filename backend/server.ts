import express from "express";
import cors from "cors";
import "dotenv/config";
import mysql from "mysql2/promise";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// Connection pool: manages database connections for us.
// The values come from backend/.env (loaded by "dotenv/config" above),
// so no credentials are written in the source code.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true, // keep SQL DATE values as "YYYY-MM-DD" strings
});

const app = express();
app.use(cors());
const PORT = 3001;

// Lets Express read JSON request bodies (needed by POST). Must come before the routes.
app.use(express.json());

// GET: read all entries from MariaDB with one SELECT query.
// "entry_date AS date" renames the column to the property name React expects.
app.get("/api/entries", async (req, res) => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, topic, entry_date AS date,
              learned, confidence, comment
       FROM learning_entries
       ORDER BY id`
    );

    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Could not load entries" });
  }
});

// POST: validate the entry, then save it with a parameterized INSERT.
app.post("/api/entries", async (req, res) => {
  const { topic, date, learned, confidence, comment } = req.body;

  if (typeof topic !== "string" || !topic.trim() ||
      typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof learned !== "string" || !learned.trim() ||
      !Number.isInteger(confidence) || confidence < 1 || confidence > 5 ||
      typeof comment !== "string" || !comment.trim()) {
    return res.status(400).json({ error: "Invalid learning entry" });
  }

  try {
    // The ? placeholders keep user values separate from the SQL text (prevents SQL injection).
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO learning_entries
       (topic, entry_date, learned, confidence, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [topic.trim(), date, learned.trim(), confidence, comment.trim()]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Could not save entry:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Could not save entry" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
