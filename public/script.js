fetch("/api/weather")
  .then(response => response.json())
  .then(data => {
    document.querySelector("h1").textContent = data.title;
    document.getElementById("city").textContent = data.city;
    document.getElementById("temperature").textContent = data.temperature;
    document.getElementById("condition").textContent = data.condition;
    document.getElementById("humidity").textContent = data.humidity;
    document.getElementById("wind").textContent = data.wind;
    document.getElementById("updatedAt").textContent = data.updatedAt;
  });