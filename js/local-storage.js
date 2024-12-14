import { addProject } from "./project-manager.js";

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

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("projects") || "[]");
}

function loadFromLocalStorage() {
  const data = getFromLocalStorage();
  if (data.length === 0) {
    addProject();
  } else {
    data.forEach(({ title, doubloons, hours }) => addProject(title, doubloons, hours));
  }
}

export { saveToLocalStorage, getFromLocalStorage, loadFromLocalStorage };
