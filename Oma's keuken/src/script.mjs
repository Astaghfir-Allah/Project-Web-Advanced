const API_BASE = "https://www.themealdb.com/api/json/v1/1/";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icoon = document.getElementById("mode-icon");
  const isDonker = document.body.classList.contains("dark-mode");
  icoon.src = isDonker ? "sun.svg" : "moon.svg";
}

function changeLanguage() {
  const taal = document.getElementById("taal").value;
  if (taal === "nl") {
    document.getElementById("titel").textContent = "Oma's keuken";
    document.getElementById("dagelijkse-titel").textContent = "Maaltijd van de Dag";
    document.getElementById("resultaten-titel").textContent = "Gerechten";
    document.getElementById("zoek").placeholder = "Zoek een maaltijd...";
    document.getElementById("zoek-knop").textContent = "Zoeken";
  } else {
    document.getElementById("titel").textContent = "Granny's kitchen";
    document.getElementById("dagelijkse-titel").textContent = "Meal of the Day";
    document.getElementById("resultaten-titel").textContent = "Recipes";
    document.getElementById("zoek").placeholder = "Search for a meal...";
    document.getElementById("zoek-knop").textContent = "Search";
  }
}

function toonMaaltijd(maaltijden, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!maaltijden || maaltijden.length === 0) {
    const taal = document.getElementById("taal").value;
    container.innerHTML = taal === "nl"
      ? "<p>Geen maaltijd gevonden.</p>"
      : "<p>No meals found.</p>";
    return;
  }

  maaltijden.forEach(maal => {
    const div = document.createElement("div");
    div.classList.add("maal");
    div.innerHTML = `
      <h3>${maal.strMeal}</h3>
      <img src="${maal.strMealThumb}" alt="${maal.strMeal}" width="200">
      <p><strong>Categorie:</strong> ${maal.strCategory}</p>
      <p><strong>Regio:</strong> ${maal.strArea}</p>
      <p><strong>Rating:</strong> ${maal.rating || "4.5 ★"}</p>
      <p><strong>Kookduur:</strong> ${maal.kookduur || "30 min"}</p>
      <p><strong>Budget:</strong> ${maal.budget || "€€"}</p>
      <p><strong>Moeilijkheid:</strong> ${maal.moeilijkheid || "Gemiddeld"}</p>
    `;
    div.addEventListener("click", () => {
      if (maal.strSource) {
        window.open(maal.strSource, "_blank");
      }
    });
    container.appendChild(div);
  });
}

document.getElementById("zoek-knop").addEventListener("click", async () => {
  const zoekterm = document.getElementById("zoek").value.trim();
  if (!zoekterm) return;
  const res = await fetch(`${API_BASE}search.php?s=${zoekterm}`);
  const data = await res.json();
  toonMaaltijd(data.meals, "maaltijd-container");
});

async function laadDagMaal() {
  const res = await fetch(`${API_BASE}random.php`);
  const data = await res.json();
  if (data.meals && data.meals.length > 0) {
    data.meals[0].rating = "4.7 ★";
    data.meals[0].kookduur = "45 min";
    data.meals[0].budget = "€€";
    data.meals[0].moeilijkheid = "Gemiddeld";
  }
  toonMaaltijd(data.meals, "dagelijks-maal");
}

async function laadRandomMaaltijden(count = 20) {
  const maaltijden = [];
  while (maaltijden.length < count) {
    const res = await fetch(`${API_BASE}random.php`);
    const data = await res.json();
    if (data.meals && data.meals.length > 0) {
      const maal = data.meals[0];
      maal.rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1) + " ★";
      maal.kookduur = `${[20,30,40,50,60][Math.floor(Math.random()*5)]} min`;
      maal.budget = ["€", "€€", "€€€"][Math.floor(Math.random()*3)];
      maal.moeilijkheid = ["Makkelijk", "Gemiddeld", "Moeilijk"][Math.floor(Math.random()*3)];
      maaltijden.push(maal);
    }
  }
  toonMaaltijd(maaltijden, "maaltijd-container");
}

laadDagMaal();
laadRandomMaaltijden();
