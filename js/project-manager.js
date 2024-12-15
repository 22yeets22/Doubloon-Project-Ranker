import { saveToLocalStorage } from "./local-storage.js";
import { doubloonImg } from "./constants.js";

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

export { addProject, addProjects, clearAll, addRemoveButton, rank, toggleDoubloonInput };
