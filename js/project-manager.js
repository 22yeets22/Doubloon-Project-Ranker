import { saveToLocalStorage } from "./local-storage.js";
import { doubloonImg, doubloonShop, colorToggleableElements } from "./constants.js";

function addProject(title = "", doubloons = "", hours = "") {
  const inputContainer = document.getElementById("input-container");
  const newSection = document.createElement("div");
  newSection.className = "input-section fade-in";
  newSection.innerHTML = `
      <input class="title" type="text" placeholder="Project Name" value="${title}">
      <input class="doubloons" type="number" placeholder="Doubloons Earned" value="${doubloons}" min="0">
      <input class="hours" type="number" placeholder="Hours Spent" value="${hours}" min="0">
      <span class="ratio"></span>
    `;
  addRemoveButton(newSection);
  inputContainer.appendChild(newSection);

  // Trigger smooth movement by recalculating layout
  newSection.offsetHeight;
}

function addProjects(projects) {
  projects.forEach(([title, doubloons, hours]) => addProject(title, doubloons, hours));
}

function clearNoConfirm() {
  document.getElementById("input-container").innerHTML = "";
  localStorage.removeItem("projects");
  addProject();
}

function clearAll() {
  Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonText: "Clear!",
  }).then((result) => {
    if (result.isConfirmed) {
      clearNoConfirm();
    }
  });
}

function addRemoveButton(section) {
  const removeButton = document.createElement("button");
  removeButton.innerHTML = `<i class="fa-solid fa-xmark"></i> Remove`;
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", () => {
    if (document.getElementById("input-container").children.length === 1) return;
    section.classList.add("fade-out");

    section.addEventListener(
      "animationend",
      () => {
        section.remove();
        saveToLocalStorage();
      },
      { once: true }
    ); // Remove the event listener after execution
  });
  section.appendChild(removeButton);
}

function clearRankings() {
  document
    .getElementById("input-container")
    .querySelectorAll(".ratio")
    .forEach((ratio) => {
      ratio.innerHTML = "";
    });
}

function toggleBackgroundColor() {
  colorToggleableElements.forEach((property) => {
    const currentColor = getComputedStyle(document.documentElement)
      .getPropertyValue(property)
      .trim();
    const lightColor = getComputedStyle(document.documentElement)
      .getPropertyValue(property + "-light-mode")
      .trim();
    const darkColor = getComputedStyle(document.documentElement)
      .getPropertyValue(property + "-dark-mode")
      .trim();

    document.documentElement.style.setProperty(
      property,
      currentColor === lightColor ? darkColor : lightColor
    );
  });

  // Instead of changing innerHTML, toggle a class
  const toggleBtn = document.getElementById("toggle-button");
  toggleBtn.classList.toggle("dark-mode");
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
      section.querySelector(".ratio").innerHTML = `(${ratio.toFixed(2)} ${doubloonImg}/hour)`;
      return { section, ratio, doubloons };
    })
    .filter(Boolean);

  if (data.length === 0) return;

  data.sort((a, b) => b.ratio - a.ratio);

  inputContainer.innerHTML = "";
  data.forEach(({ section }) => inputContainer.appendChild(section));
}

function toggleDoubloonInput() {
  const doubloonDropdown = document.getElementById("doubloon-dropdown");
  const doubloonInput = document.getElementById("doubloon-input");
  const doubloonInputDiv = document.getElementById("doubloon-input-div");
  const orText = document.getElementById("or-text");

  const showInput = doubloonDropdown.value === "---";
  doubloonInputDiv.style.display = showInput ? "inline" : "none";

  const showDropdown = doubloonInput.value === "";
  doubloonDropdown.style.display = showDropdown ? "inline" : "none";

  orText.style.display = showDropdown && showInput ? "inline" : "none";
}

function addShopValues() {
  const dropdown = document.getElementById("doubloon-dropdown");

  // Add the default option
  dropdown.innerHTML = '<option value="---" selected="selected">---</option>';

  // Add options from the dictionary
  for (const item in doubloonShop) {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  }
}

export {
  addProject,
  addProjects,
  clearAll,
  clearNoConfirm,
  addRemoveButton,
  rank,
  addShopValues,
  toggleDoubloonInput,
  toggleBackgroundColor,
  clearRankings,
};
