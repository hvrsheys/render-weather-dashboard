async function loadWeather() {
  const response = await fetch("/api/weather");
  const data = await response.json();

  document.getElementById("city").textContent = data.city;
  document.getElementById("temperature").textContent = data.temperature;
  document.getElementById("condition").textContent = data.condition;
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("wind").textContent = data.wind;
  document.getElementById("updatedAt").textContent = data.updatedAt;
}

async function loadLogs() {
  const response = await fetch("/api/weather-logs");
  const logs = await response.json();

  const table = document.getElementById("logsTable");
  table.innerHTML = "";

  logs.forEach((log) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${log.city}</td>
      <td>${log.temperature}</td>
      <td>${log.condition}</td>
      <td>${new Date(log.created_at).toLocaleString()}</td>
    `;

    table.appendChild(row);
  });
}

document.getElementById("saveBtn").addEventListener("click", async () => {
  await fetch("/api/weather-log", {
    method: "POST"
  });

  await loadLogs();
});

loadWeather();
loadLogs();