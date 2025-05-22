function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
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
