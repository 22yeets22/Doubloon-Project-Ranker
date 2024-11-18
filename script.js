function saveToLocalStorage() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));
  const data = inputSections.map((section) => ({
    title: section.querySelector(".title").value,
    doubloons: section.querySelector(".doubloons").value,
    hours: section.querySelector(".hours").value,
  }));
  localStorage.setItem("projects", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("projects") || "[]");
  if (data.length === 0) {
    addProject();
  } else {
    data.forEach(({ title, doubloons, hours }) => addProject(title, doubloons, hours));
  }
}

function addRemoveButton(section) {
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", () => {
    section.remove();
    saveToLocalStorage();
  });
  section.appendChild(removeButton);
}

function clearAll() {
  Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonText: "Clear!",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("input-container").innerHTML = "";
      localStorage.removeItem("projects");
      addProject();
    }
  });
}

function rank() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));
  const data = inputSections
    .map((section) => {
      const title = section.querySelector(".title").value;
      const doubloons = parseFloat(section.querySelector(".doubloons").value);
      const hours = parseFloat(section.querySelector(".hours").value);

      if (isNaN(doubloons) || isNaN(hours) || hours <= 0) return null;

      const ratio = doubloons / hours;
      section.querySelector(".ratio").textContent = `(${ratio.toFixed(2)} doubloons/hour)`;
      return { section, ratio, doubloons };
    })
    .filter(Boolean);

  data.sort((a, b) => b.ratio - a.ratio);

  inputContainer.innerHTML = "";
  data.forEach(({ section }) => inputContainer.appendChild(section));
}

function clearStats() {
  document.getElementById("stats-heading").style.visibility = "hidden";
  document.getElementById("average-doubloon").textContent = "";
  document.getElementById("median-doubloon").textContent = "";
  document.getElementById("stdev-doubloon").textContent = "";
}

function stats() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));

  const doubloonsArray = inputSections
    .map((section) => parseFloat(section.querySelector(".doubloons").value))
    .filter((value) => !isNaN(value));

  if (doubloonsArray.length === 0) return;

  const total = doubloonsArray.reduce((sum, value) => sum + value, 0);
  const average = total / doubloonsArray.length;

  const sorted = [...doubloonsArray].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const variance =
    doubloonsArray.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    doubloonsArray.length;
  const stdev = Math.sqrt(variance);

  document.getElementById("stats-heading").style.visibility = "visible";
  document.getElementById("average-doubloon").textContent = `Average: ${average.toFixed(2)}`;
  document.getElementById("median-doubloon").textContent = `Median: ${median.toFixed(2)}`;
  document.getElementById("stdev-doubloon").textContent = `Std Dev: ${stdev.toFixed(2)}`;
}

function addProject(title = "", doubloons = "", hours = "") {
  const inputContainer = document.getElementById("input-container");
  const newSection = document.createElement("div");
  newSection.className = "input-section fade-in";
  newSection.innerHTML = `
    <input class="title" type="text" placeholder="Title" value="${title}">
    <input class="doubloons" type="number" placeholder="Doubloons Earned" value="${doubloons}">
    <input class="hours" type="number" placeholder="Hours Spent" value="${hours}">
    <span class="ratio"></span>
  `;
  addRemoveButton(newSection);
  inputContainer.appendChild(newSection);
}

function addEventListeners() {
  const clearProjectsAndSave = () => {
    clearAll();
    clearStats();
    saveToLocalStorage();
  };
  const addProjectAndSave = () => {
    addProject();
    clearStats();
    saveToLocalStorage();
  };
  const rankProjectsAndSave = () => {
    rank();
    stats();
    saveToLocalStorage();
  };

  document.getElementById("add-button").addEventListener("click", addProjectAndSave);
  document.getElementById("rank-button").addEventListener("click", rankProjectsAndSave);
  document.getElementById("clear-button").addEventListener("click", clearProjectsAndSave);
  document.addEventListener("keydown", (event) => {
    if (event.key === "n" || event.key === "N") {
      addProjectAndSave();
    } else if (event.key === "r" || event.key === "R") {
      rankProjectsAndSave();
    } else if (event.key === "c" || event.key === "C") {
      clearProjectsAndSave();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  addEventListeners();
});
