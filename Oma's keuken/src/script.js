const API_BASE = "https://www.themealdb.com/api/json/v1/1/";
let huidigeMaaltijden = [];

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icoon = document.getElementById("mode-icon");
  const isDonker = document.body.classList.contains("dark-mode");
  icoon.src = isDonker ? "pictures/sun.svg" : "pictures/moon.svg";
}

function changeLanguage() {
  const taal = document.getElementById("taal").value;

  if (taal === "nl") {
    document.getElementById("titel").textContent = "Oma's keuken";
    document.getElementById("dagelijkse-titel").textContent = "Maaltijd van de Dag";
    document.getElementById("resultaten-titel").textContent = "Recepten";
    document.getElementById("zoek").placeholder = "Zoek een maaltijd...";
    document.getElementById("zoek-knop").textContent = "Zoeken";
    document.querySelector("#categorie-filter option[value='all']").textContent = "Alle categorieën";
    document.querySelector("#sortering option[value='default']").textContent = "Sorteer op";
  } else {
    document.getElementById("titel").textContent = "Granny's kitchen";
    document.getElementById("dagelijkse-titel").textContent = "Meal of the Day";
    document.getElementById("resultaten-titel").textContent = "Recipes";
    document.getElementById("zoek").placeholder = "Search for a meal...";
    document.getElementById("zoek-knop").textContent = "Search";
    document.querySelector("#categorie-filter option[value='all']").textContent = "All categories";
    document.querySelector("#sortering option[value='default']").textContent = "Sort by";
  }

  document.querySelector("label[for='categorie-filter']").textContent =
    taal === "nl" ? "Filter op categorie:" : "Filter by category:";
  document.querySelector("label[for='sortering']").textContent =
    taal === "nl" ? "Sorteer op:" : "Sort by:";
  document.querySelector("label[for='regio-filter']").textContent =
    taal === "nl" ? "Regio" : "Region";
  document.querySelector("label[for='rating-filter']").textContent =
    taal === "nl" ? "Rating" : "Rating";
  document.querySelector("label[for='kookduur-filter']").textContent =
    taal === "nl" ? "Kookduur" : "Cooking Time";
  document.querySelector("label[for='budget-filter']").textContent =
    taal === "nl" ? "Budget" : "Budget";
  document.querySelector("label[for='moeilijkheid-filter']").textContent =
    taal === "nl" ? "Moeilijkheid" : "Difficulty";

  const sortOpties = document.getElementById("sortering").options;
  if (taal === "nl") {
    sortOpties[0].text = "Sorteer op";
    sortOpties[1].text = "Naam A-Z";
    sortOpties[2].text = "Naam Z-A";
    sortOpties[3].text = "Tijd Oplopend";
    sortOpties[4].text = "Tijd Aflopend";
    sortOpties[5].text = "Hoogste Rating";
  } else {
    sortOpties[0].text = "Sort by";
    sortOpties[1].text = "Name A-Z";
    sortOpties[2].text = "Name Z-A";
    sortOpties[3].text = "Time Ascending";
    sortOpties[4].text = "Time Descending";
    sortOpties[5].text = "Top Rated";
  }
}

function toonMaaltijd(maaltijden, containerId, zoekResultaat = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (containerId === "maaltijd-container") {
    const titelEl = document.getElementById("resultaten-titel");
    const taal = document.getElementById("taal").value;
    titelEl.textContent = zoekResultaat
      ? (taal === "nl" ? "Zoekresultaten" : "Search Results")
      : (taal === "nl" ? "Recepten" : "Recipes");

    huidigeMaaltijden = maaltijden ? [...maaltijden] : [];
  }

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

    if (containerId === "dagelijks-maal") {
      div.classList.add("aanbevolen-maal");
    }

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
  toonMaaltijd(data.meals, "maaltijd-container", true);
});

document.getElementById("zoek").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("zoek-knop").click();
  }
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
  toonMaaltijd(maaltijden, "maaltijd-container", false);
}

document.getElementById("sortering").addEventListener("change", pasFilterToe);
document.getElementById("categorie-filter").addEventListener("change", pasFilterToe);

function pasFilterToe() {
  let maaltijden = [...huidigeMaaltijden];

  const geselecteerdeCategorie = document.getElementById("categorie-filter").value;
  if (geselecteerdeCategorie !== "all") {
    maaltijden = maaltijden.filter(m => m.strCategory === geselecteerdeCategorie);
  }

  const geselecteerdeRegio = document.getElementById("regio-filter")?.value;
  if (geselecteerdeRegio && geselecteerdeRegio !== "all") {
    maaltijden = maaltijden.filter(m => m.strArea === geselecteerdeRegio);
  }

  const geselecteerdeRating = document.getElementById("rating-filter")?.value;
  if (geselecteerdeRating && geselecteerdeRating !== "all") {
    maaltijden = maaltijden.filter(m => parseFloat(m.rating) >= parseFloat(geselecteerdeRating));
  }

  const geselecteerdeTijd = document.getElementById("kookduur-filter")?.value;
  if (geselecteerdeTijd && geselecteerdeTijd !== "all") {
    maaltijden = maaltijden.filter(m => parseInt(m.kookduur) <= parseInt(geselecteerdeTijd));
  }

  const geselecteerdBudget = document.getElementById("budget-filter")?.value;
  if (geselecteerdBudget && geselecteerdBudget !== "all") {
    maaltijden = maaltijden.filter(m => m.budget === geselecteerdBudget);
  }

  const geselecteerdeMoeilijkheid = document.getElementById("moeilijkheid-filter")?.value;
  if (geselecteerdeMoeilijkheid && geselecteerdeMoeilijkheid !== "all") {
    maaltijden = maaltijden.filter(m => m.moeilijkheid === geselecteerdeMoeilijkheid);
  }

  const sortering = document.getElementById("sortering").value;
  switch (sortering) {
    case "naam-asc":
      maaltijden.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
      break;
    case "naam-desc":
      maaltijden.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
      break;
    case "tijd-oplopend":
      maaltijden.sort((a, b) => parseInt(a.kookduur) - parseInt(b.kookduur));
      break;
    case "tijd-aflopend":
      maaltijden.sort((a, b) => parseInt(b.kookduur) - parseInt(a.kookduur));
      break;
    case "rating":
      maaltijden.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      break;
  }

  toonMaaltijd(maaltijden, "maaltijd-container");
}


async function laadCategorieën() {
  const res = await fetch(`${API_BASE}list.php?c=list`);
  const data = await res.json();
  const select = document.getElementById("categorie-filter");
  data.meals.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.strCategory;
    opt.textContent = cat.strCategory;
    select.appendChild(opt);
  });
}

window.addEventListener("load", () => {
  changeLanguage();
  laadDagMaal();
  laadRandomMaaltijden();
  laadCategorieën();
});
