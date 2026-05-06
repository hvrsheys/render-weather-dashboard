const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.RENDER ? { rejectUnauthorized: false } : false
});

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_logs (
      id SERIAL PRIMARY KEY,
      city TEXT NOT NULL,
      temperature TEXT NOT NULL,
      condition TEXT NOT NULL,
      humidity TEXT NOT NULL,
      wind TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

const getWeatherData = () => ({
  city: process.env.CITY || "Kuching",
  temperature: "31°C",
  condition: "Partly Cloudy",
  humidity: "78%",
  wind: "8 km/h",
  updatedAt: new Date().toLocaleString()
});

app.get("/api/weather", (req, res) => {
  res.json(getWeatherData());
});

app.post("/api/weather-log", async (req, res) => {
  try {
    const weather = getWeatherData();

    const result = await pool.query(
      `INSERT INTO weather_logs (city, temperature, condition, humidity, wind)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        weather.city,
        weather.temperature,
        weather.condition,
        weather.humidity,
        weather.wind
      ]
    );

    res.json({
      message: "Weather log saved successfully",
      log: result.rows[0]
    });
  } catch (error) {
    console.error("Database insert error:", error);
    res.status(500).json({ error: "Failed to save weather log" });
  }
});

app.get("/api/weather-logs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM weather_logs ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database read error:", error);
    res.status(500).json({ error: "Failed to retrieve weather logs" });
  }
});

createTable()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Weather Dashboard running on ${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialise database:", error);
    process.exit(1);
  });