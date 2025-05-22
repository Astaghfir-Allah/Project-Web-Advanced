const API_BASIS = "https://www.themealdb.com/api/json/v1/1/";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const pictogram = document.getElementById("mode-icon");
  const isDonker = document.body.classList.contains("dark-mode");
  pictogram.src = isDonker ? "pictures/sun.svg" : "pictures/moon.svg";
}

function changeLanguage() {
  const taal = document.getElementById("taal").value;
  if (taal === "nl") {
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

function toonMaaltijd(maaltijden, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!maaltijden) {
    const taal = document.getElementById("taal").value;
    container.innerHTML = taal === "nl"
      ? "<p>Geen maaltijd gevonden.</p>"
      : "<p>Error 404: Meal not found. Time for a diet I guess.</p>";
    return;
  }

  maaltijden.forEach(maal => {
    const kaart = document.createElement("div");
    kaart.classList.add("maal");
    kaart.innerHTML = `
      <h3>${maal.strMeal}</h3>
      <img src="${maal.strMealThumb}" alt="${maal.strMeal}" width="200">
      <p><strong>Categorie:</strong> ${maal.strCategory}</p>
      <p><strong>Regio:</strong> ${maal.strArea}</p>
      <button onclick="showDetails(${maal.idMeal})">Details</button>
    `;
    container.appendChild(kaart);
  });
}

document.getElementById("zoek-knop").addEventListener("click", async () => {
  const zoekterm = document.getElementById("zoek").value.trim();
  if (!zoekterm) return;
  const antwoord = await fetch(`${API_BASIS}search.php?s=${zoekterm}`);
  const data = await antwoord.json();
  toonMaaltijd(data.meals, "maaltijd-container");
});

async function laadDagMaal() {
  const antwoord = await fetch(`${API_BASIS}random.php`);
  const data = await antwoord.json();
  toonMaaltijd(data.meals, "dagelijks-maal");
}
laadDagMaal();

function showDetails(maaltijdId) {
  alert("Detailpagina voor maaltijd ID: " + maaltijdId);
}
