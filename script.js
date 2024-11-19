let mean, median, stdev;
const doubloonValues = {
  stickers: 17,
  digitalOceanCredits: 28,
  openAIcredits: 28,
  hetznerCredits: 28,
  anthropicCredits: 28,
  hackClubMicroSD: 30,
  logicAnalyzer: 34,
  biteSizeLinux: 40,
  biteSizeBash: 40,
  howDNSWorks: 40,
  domain1Year: 40,
  signedPhotoMalted: 42,
  raspberryPi: 48,
  raspberryPi2: 48,
  digitalCalipers: 50,
  pcbManufacturing: 55,
  adafruitItsyBitsy: 55,
  hotGlueGun: 57,
  digiKeyLCSC: 63,
  githubInvertocatPin: 76,
  signedPhotoGraham: 80,
  pinecil: 82,
  githubNotebook: 140,
  blahaj: 123,
  baofengUV5R: 126,
  lockpickSet: 154,
  githubKeycaps: 154,
  hackClubSocks: 156,
  githubUniverseBadge: 172,
  fudge: 240,
  yubikey: 264,
  dremel4300Kit: 265,
  raspberryPi5: 275,
  system76LaunchKeyboard: 520,
  githubMiirBackpack: 725,
  flipper: 850,
  bambuLabA1Mini: 1000,
  thermalImagingCamera: 1015,
  hotAirReworkStation: 1120,
  oscilloscope100MHz: 1210,
  ipad: 2090,
  frameworkLaptop13: 3075,
  macbookAirM213: 4000,
  frameworkLaptop16: 4980,
  ticketToDEFCON: 6675,
};

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
    section.classList.add("fade-out"); // Add fade-out animation
    setTimeout(() => {
      section.remove(); // Remove after animation
      saveToLocalStorage();
    }, 500); // Match the animation duration
  });
  section.appendChild(removeButton);
}

function addProject(title = "", doubloons = "", hours = "") {
  const inputContainer = document.getElementById("input-container");
  const newSection = document.createElement("div");
  newSection.className = "input-section fade-in";
  newSection.innerHTML = `
    <input class="title" type="text" placeholder="Project Name" value="${title}">
    <input class="doubloons" type="number" placeholder="Doubloons Earned" value="${doubloons}">
    <input class="hours" type="number" placeholder="Hours Spent" value="${hours}">
    <span class="ratio"></span>
  `;
  addRemoveButton(newSection);
  inputContainer.appendChild(newSection);

  // Trigger smooth movement by recalculating layout
  newSection.offsetHeight;
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
  document.getElementById("stats").style = "visibility: hidden;";
  document.getElementById("time-calculation-result").textContent = "";
}

function stats() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));

  const doubloonsArray = inputSections
    .map((section) => parseFloat(section.querySelector(".doubloons").value))
    .filter((value) => !isNaN(value));

  if (doubloonsArray.length === 0) return;

  const total = doubloonsArray.reduce((sum, value) => sum + value, 0);
  mean = total / doubloonsArray.length;

  const sorted = [...doubloonsArray].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const variance =
    doubloonsArray.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    doubloonsArray.length;
  stdev = Math.sqrt(variance);

  document.getElementById("average-doubloon").textContent = `Average: ${mean.toFixed(2)}`;
  document.getElementById("median-doubloon").textContent = `Median: ${median.toFixed(2)}`;
  document.getElementById("stdev-doubloon").textContent = `Std Dev: ${stdev.toFixed(2)}`;
  document.getElementById("stats").style = "visibility: visible;";
}

function timeCalculate() {
  const doubloonDropdown = document.getElementById("doubloon-dropdown");
  const doubloonsInput = document.getElementById("doubloon-input");
  const timeCalcResult = document.getElementById("time-calculation-result");

  const minRate = mean - stdev;
  const maxRate = mean + stdev;
  let doubloonsNeeded;
  if (doubloonDropdown.value === "---") {
    // Use the number input instead
    doubloonsNeeded = parseFloat(doubloonsInput.value);
  } else {
    // Use the dropdown instead
    if (doubloonDropdown.value in doubloonValues) {
      doubloonsNeeded = doubloonValues[doubloonDropdown.value];
    } else {
      timeCalcResult.textContent = "Invalid doubloon type";
      return;
    }
  }

  let minTime = doubloonsNeeded / maxRate;
  let maxTime = doubloonsNeeded / minRate;
  timeCalcResult.textContent = `${minTime.toFixed(2)} hours - ${maxTime.toFixed(2)} hours`;
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
    // Check if nothing is focused
    if (document.activeElement === document.body) {
      if (event.key === "n" || event.key === "N") {
        addProjectAndSave();
      } else if (event.key === "r" || event.key === "R") {
        rankProjectsAndSave();
      } else if (event.key === "c" || event.key === "C") {
        clearProjectsAndSave();
      }
    }
  });

  document.getElementById("submit-button").addEventListener("click", timeCalculate);
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  clearStats();
  addEventListeners();
});
