let dataGlobal = [];
let currentSortColumn = null;
let currentSortDirection = "asc"; // nebo 'desc'

// Načíst data
fetch("data/prices.json")
  .then((response) => response.json())
  .then((data) => {
    dataGlobal = data;
    renderTable(dataGlobal);
  })
  .catch((error) => console.error("Error loading JSON:", error));

// Vykreslit tabulku
function renderTable(data) {
  const tbody = document.querySelector("#zip-table tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    const zipCell = document.createElement("td");
    zipCell.textContent = item.zip;
    row.appendChild(zipCell);

    const cityCell = document.createElement("td");
    cityCell.textContent = item.city;
    row.appendChild(cityCell);

    const stateCell = document.createElement("td");
    stateCell.textContent = item.state;
    row.appendChild(stateCell);

    const pricePerSqftCell = document.createElement("td");
    pricePerSqftCell.textContent = `$${item.price_per_sqft.toFixed(2)}`;
    row.appendChild(pricePerSqftCell);

    const medianPriceCell = document.createElement("td");
    medianPriceCell.textContent = `$${item.median_price.toLocaleString()}`;
    row.appendChild(medianPriceCell);

    tbody.appendChild(row);
  });
}

// Řazení tabulky
function sortTable(column) {
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortColumn = column;
    currentSortDirection = "asc";
  }

  const sortedData = [...dataGlobal].sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    // konverze čísel na čísla
    if (typeof aVal === "number" && typeof bVal === "number") {
      return currentSortDirection === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
      if (aVal < bVal) return currentSortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return currentSortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  renderTable(sortedData);
  updateSortIcons();
}

// Aktualizace šipek
function updateSortIcons() {
  document.querySelectorAll("#zip-table th").forEach((header) => {
    header.classList.remove("sort-asc", "sort-desc");
    if (header.getAttribute("data-sort") === currentSortColumn) {
      header.classList.add(
        currentSortDirection === "asc" ? "sort-asc" : "sort-desc"
      );
    }
  });
}

// Event listenery
document.querySelectorAll("#zip-table th").forEach((header) => {
  header.addEventListener("click", () => {
    const column = header.getAttribute("data-sort");
    sortTable(column);
  });
});

// Specialní řazení pro ZIP kód
const sortedData = [...dataGlobal].sort((a, b) => {
  let aVal = a[column];
  let bVal = b[column];

  if (column === "zip") {
    // Pro ZIP code, převést na čísla
    aVal = parseInt(aVal, 10);
    bVal = parseInt(bVal, 10);
  }

  if (typeof aVal === "number" && typeof bVal === "number") {
    return currentSortDirection === "asc" ? aVal - bVal : bVal - aVal;
  } else {
    aVal = aVal.toString().toLowerCase();
    bVal = bVal.toString().toLowerCase();
    if (aVal < bVal) return currentSortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return currentSortDirection === "asc" ? 1 : -1;
    return 0;
  }
});