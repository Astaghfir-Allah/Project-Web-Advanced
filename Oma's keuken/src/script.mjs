const API_BASIS = "https://www.themealdb.com/api/json/v1/1/";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.getElementById("mode-icon");
  const isDark = document.body.classList.contains("dark-mode");
  icon.src = isDark ? "sun.svg" : "moon.svg";
}

function changeLanguage() {
  const lang = document.getElementById("taal").value;
  if (lang === "nl") {
    document.getElementById("titel").textContent = "Oma's keuken";
    document.getElementById("dagelijkse-titel").textContent = "Maaltijd van de Dag";
    document.getElementById("resultaten-titel").textContent = "Zoekresultaten";
    document.getElementById("zoek").placeholder = "Zoek een maaltijd...";
  } else {
    document.getElementById("titel").textContent = "Granny's kitchen";
    document.getElementById("dagelijkse-titel").textContent = "Meal of the Day";
    document.getElementById("resultaten-titel").textContent = "Search Results";
    document.getElementById("zoek").placeholder = "Search for a meal...";
  }
}

document.getElementById("zoek").addEventListener("input", async (event) => {
  const zoekterm = event.target.value;
  if (!zoekterm) return;
  const antwoord = await fetch(`${API_BASIS}search.php?s=${zoekterm}`);
  const data = await antwoord.json();
  toonMaaltijd(data.meals, "maaltijd-container");
});
