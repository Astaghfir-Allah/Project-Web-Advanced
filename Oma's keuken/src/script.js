const API_BASE = "https://www.themealdb.com/api/json/v1/1/";
let huidigeMaaltijden = [];
let filterPopupOpen = false;

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

    const sortering = document.getElementById("sortering");
    sortering.options[0].text = "Sorteer op";
    sortering.options[1].text = "Naam A-Z";
    sortering.options[2].text = "Naam Z-A";
    sortering.options[3].text = "Tijd Oplopend";
    sortering.options[4].text = "Tijd Aflopend";
    sortering.options[5].text = "Hoogste Rating";

    document.querySelector("label[for='categorie-filter']").textContent = "Filter op categorie:";
    document.querySelector("label[for='regio-filter']").textContent = "Regio";
    document.querySelector("label[for='rating-filter']").textContent = "Rating";
    document.querySelector("label[for='kookduur-filter']").textContent = "Kookduur";
    document.querySelector("label[for='budget-filter']").textContent = "Budget";
    document.querySelector("label[for='moeilijkheid-filter']").textContent = "Moeilijkheid";

  } else {
    document.getElementById("titel").textContent = "Granny's kitchen";
    document.getElementById("dagelijkse-titel").textContent = "Meal of the Day";
    document.getElementById("resultaten-titel").textContent = "Recipes";
    document.getElementById("zoek").placeholder = "Search for a meal...";
    document.getElementById("zoek-knop").textContent = "Search";

    const sortering = document.getElementById("sortering");
    sortering.options[0].text = "Sort by";
    sortering.options[1].text = "Name A-Z";
    sortering.options[2].text = "Name Z-A";
    sortering.options[3].text = "Time Ascending";
    sortering.options[4].text = "Time Descending";
    sortering.options[5].text = "Top Rated";

    document.querySelector("label[for='categorie-filter']").textContent = "Filter by category:";
    document.querySelector("label[for='regio-filter']").textContent = "Region";
    document.querySelector("label[for='rating-filter']").textContent = "Rating";
    document.querySelector("label[for='kookduur-filter']").textContent = "Cooking Time";
    document.querySelector("label[for='budget-filter']").textContent = "Budget";
    document.querySelector("label[for='moeilijkheid-filter']").textContent = "Difficulty";
  }

  const allOptions = {
    nl: "Alle",
    en: "All"
  };
  ["categorie-filter", "regio-filter", "rating-filter", "kookduur-filter", "budget-filter", "moeilijkheid-filter"].forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      const optAll = select.querySelector("option[value='all']");
      if (optAll) optAll.textContent = allOptions[taal];
    }
  });

  const moeilijkheidOpties = {
    nl: ["Makkelijk", "Gemiddeld", "Moeilijk"],
    en: ["Easy", "Medium", "Hard"]
  };
  const moeilijkheidSelect = document.getElementById("moeilijkheid-filter");
  if (moeilijkheidSelect) {
    const huidigeWaarde = moeilijkheidSelect.value;
    moeilijkheidSelect.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = allOptions[taal];
    moeilijkheidSelect.appendChild(optAll);
    moeilijkheidOpties[taal].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      moeilijkheidSelect.appendChild(option);
    });
    moeilijkheidSelect.value = huidigeWaarde || "all";
  }

  const budgetOpties = {
    nl: ["€", "€€", "€€€"],
    en: ["€", "€€", "€€€"]
  };
  const budgetSelect = document.getElementById("budget-filter");
  if (budgetSelect) {
    const huidigeWaarde = budgetSelect.value;
    budgetSelect.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = allOptions[taal];
    budgetSelect.appendChild(optAll);
    budgetOpties[taal].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      budgetSelect.appendChild(option);
    });
    budgetSelect.value = huidigeWaarde || "all";
  }
}

function toonMaaltijd(maaltijden, containerId, zoekResultaat = false) {
  const container = document.getElementById(containerId);
  console.log("Container gevonden:", container);
  console.log("Te tonen maaltijden:", maaltijden);
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

    if (maal.strSource) {
      div.style.cursor = "pointer";
      div.addEventListener("click", () => {
        window.open(maal.strSource, "_blank");
      });
    }

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
    console.log("API data:", data);
    if (data.meals && data.meals.length > 0) {
      const maal = data.meals[0];
      maal.rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1) + " ★";
      maal.kookduur = `${[20,30,40,50,60][Math.floor(Math.random()*5)]} min`;
      maal.budget = ["€", "€€", "€€€"][Math.floor(Math.random()*3)];
      maal.moeilijkheid = ["Makkelijk", "Gemiddeld", "Moeilijk"][Math.floor(Math.random()*3)];
      maaltijden.push(maal);
    }
  }
  console.log("Maaltijden die getoond worden:", maaltijden);
  toonMaaltijd(maaltijden, "maaltijd-container", false);
}

document.getElementById("filter-knop").addEventListener("click", () => {
  const popup = document.getElementById("filter-popup");
  if (!filterPopupOpen) {
    popup.style.display = "block";
    filterPopupOpen = true;
  } else {
    popup.style.display = "none";
    filterPopupOpen = false;
  }
});

function pasFilterToe() {
  let maaltijden = [...huidigeMaaltijden];

  const geselecteerdeCategorie = document.getElementById("categorie-filter").value;
  if (geselecteerdeCategorie !== "all") {
    maaltijden = maaltijden.filter(m => m.strCategory === geselecteerdeCategorie);
  }

  const geselecteerdeRegio = document.getElementById("regio-filter").value;
  if (geselecteerdeRegio !== "all") {
    maaltijden = maaltijden.filter(m => m.strArea === geselecteerdeRegio);
  }

  const geselecteerdeRating = document.getElementById("rating-filter").value;
  if (geselecteerdeRating !== "all") {
    maaltijden = maaltijden.filter(m => {
      const ratingNum = parseFloat(m.rating);
      return ratingNum >= parseFloat(geselecteerdeRating);
    });
  }

  const geselecteerdeKookduur = document.getElementById("kookduur-filter").value;
  if (geselecteerdeKookduur !== "all") {
    maaltijden = maaltijden.filter(m => {
      const tijd = parseInt(m.kookduur);
      if (geselecteerdeKookduur === "30min") return tijd <= 30;
      if (geselecteerdeKookduur === "60min") return tijd <= 60;
      return true;
    });
  }

  const geselecteerdBudget = document.getElementById("budget-filter").value;
  if (geselecteerdBudget !== "all") {
    maaltijden = maaltijden.filter(m => m.budget === geselecteerdBudget);
  }

  const geselecteerdeMoeilijkheid = document.getElementById("moeilijkheid-filter").value;
  if (geselecteerdeMoeilijkheid !== "all") {
    maaltijden = maaltijden.filter(m => m.moeilijkheid === geselecteerdeMoeilijkheid);
  }

  toonMaaltijd(maaltijden, "maaltijd-container");
}

document.getElementById("pas-filter-toe").addEventListener("click", () => {
  pasFilterToe();
  document.getElementById("filter-popup").style.display = "none";
  filterPopupOpen = false;
});

document.getElementById("sortering").addEventListener("change", () => {
  const sorteerwaarde = document.getElementById("sortering").value;
  let maaltijden = [...huidigeMaaltijden];

  switch (sorteerwaarde) {
    case "naam-asc":
      maaltijden.sort((a,b) => a.strMeal.localeCompare(b.strMeal));
      break;
    case "naam-desc":
      maaltijden.sort((a,b) => b.strMeal.localeCompare(a.strMeal));
      break;
    case "tijd-asc":
      maaltijden.sort((a,b) => parseInt(a.kookduur) - parseInt(b.kookduur));
      break;
    case "tijd-desc":
      maaltijden.sort((a,b) => parseInt(b.kookduur) - parseInt(a.kookduur));
      break;
    case "rating-desc":
      maaltijden.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
      break;
    default:
      break;
  }
  toonMaaltijd(maaltijden, "maaltijd-container");
});

async function laadCategorieën() {
  const res = await fetch(`${API_BASE}list.php?c=list`);
  const data = await res.json();
  const select = document.getElementById("categorie-filter");
  select.innerHTML = "";

  const taal = document.getElementById("taal").value;
  const allText = taal === "nl" ? "Alle" : "All";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = allText;
  select.appendChild(optAll);

  data.meals.forEach(categorie => {
    const opt = document.createElement("option");
    opt.value = categorie.strCategory;
    opt.textContent = categorie.strCategory;
    select.appendChild(opt);
  });
}

async function laadRegioFilter() {
  const res = await fetch(`${API_BASE}list.php?a=list`);
  const data = await res.json();
  const select = document.getElementById("regio-filter");
  select.innerHTML = "";

  const taal = document.getElementById("taal").value;
  const allText = taal === "nl" ? "Alle" : "All";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = allText;
  select.appendChild(optAll);

  data.meals.forEach(area => {
    const opt = document.createElement("option");
    opt.value = area.strArea;
    opt.textContent = area.strArea;
    select.appendChild(opt);
  });
}

window.addEventListener("load", () => {
  laadDagMaal();
  laadRandomMaaltijden();
  laadCategorieën();
  laadRegioFilter();
  changeLanguage();
});
