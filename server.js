const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/weather", (req, res) => {
  res.json({
    city: process.env.CITY || "Kuching",
    temperature: "31°C",
    condition: "Partly Cloudy",
    humidity: "78%",
    wind: "8 km/h",
    updatedAt: new Date().toLocaleString()
  });
});

app.listen(PORT, () => {
  console.log(`Weather Dashboard running on port ${PORT}`);
});