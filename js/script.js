import { saveToLocalStorage, getFromLocalStorage, loadFromLocalStorage } from "./local-storage.js";
import { addProject, clearAll, rank } from "./project-manager.js";
import { clearStats, timeCalculate, stats } from "./stats.js";
import { toggleDoubloonInput } from "./project-manager.js";

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

  document.getElementById("doubloon-dropdown").addEventListener("change", toggleDoubloonInput);
  document.getElementById("doubloon-input").addEventListener("change", toggleDoubloonInput);
  document.getElementById("submit-button").addEventListener("click", timeCalculate);
}

function decodeQuery(queryString) {
  const params = new URLSearchParams(queryString);
  const data = params.get("data");
  if (!data) return [];

  return data.split(";").map((project) => {
    const [name, floatVal, intVal] = project.split(",").map(decodeURIComponent);
    return [name, parseFloat(floatVal), parseInt(intVal, 10)];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlProjects = decodeQuery(location.search);
  if (urlProjects.length > 0 && getFromLocalStorage().length > 0) {
    Swal.fire({
      title: "Do you want to override your saved projects?",
      showCancelButton: true,
      confirmButtonText: "Override!",
    }).then((result) => {
      if (result.isConfirmed) {
        urlProjects.forEach(([name, hours, doubloons]) => {
          addProject(name, doubloons, hours);
        });
      } else {
        loadFromLocalStorage();
      }
      document.location = "/";
    });
  } else {
    loadFromLocalStorage();
  }
  clearStats();
  addEventListeners();
});
