function saveToLocalStorage() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));
  const data = inputSections.map((section) => ({
    title: section.getElementsByClassName("title")[0].value,
    doubloons: section.getElementsByClassName("doubloons")[0].value,
    hours: section.getElementsByClassName("hours")[0].value,
  }));
  localStorage.setItem("projects", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("projects") || "[]");
  data.forEach((item) => {
    addProject(item.title, item.doubloons, item.hours);
  });
}

function addRemoveButton(section) {
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", function () {
    section.remove();
    saveToLocalStorage();
  });
  section.appendChild(removeButton);
}

function clearAll() {
  Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const inputContainer = document.getElementById("input-container");
      inputContainer.innerHTML = "";
      localStorage.removeItem("projects");
      addProject();
    }
  });
}

// All the button events
document.getElementById("clear-button").addEventListener("click", function () {
  clearAll();
  saveToLocalStorage();
});
document.getElementById("add-button").addEventListener("click", function () {
  addProject();
  saveToLocalStorage();
});
document.getElementById("rank-button").addEventListener("click", function () {
  rank();
  saveToLocalStorage();
});

function rank() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));
  const data = [];

  inputSections.forEach((section) => {
    const title = section.getElementsByClassName("title")[0].value;
    const doubloons = parseFloat(section.getElementsByClassName("doubloons")[0].value);
    const hours = parseFloat(section.getElementsByClassName("hours")[0].value);
    if (!isNaN(doubloons) && !isNaN(hours) && hours > 0) {
      const ratio = doubloons / hours;
      section.querySelector(".ratio").textContent = `(${ratio.toFixed(2)} doubloons/hour)`;
      data.push({ section, ratio });
    }
  });

  data.sort((a, b) => b.ratio - a.ratio);

  inputContainer.innerHTML = "";
  data.forEach((item) => {
    item.section.classList.add("fade-in");
    inputContainer.appendChild(item.section);
  });
}

function addProject(title = "", doubloons = "", hours = "") {
  const inputContainer = document.getElementById("input-container");
  const newSection = document.createElement("div");
  newSection.className = "input-section fade-in";
  newSection.innerHTML = `
        <input class="title" type="text" placeholder="Title" value="${title}">
        <input class="doubloons" type="number" placeholder="Doubloons Earned" value="${doubloons}">
        <input class="hours" type="number" placeholder="Hours Spent" value="${hours}">
        <span class="ratio" style="text-align: center"></span>
        `;
  addRemoveButton(newSection);
  inputContainer.appendChild(newSection);
}

loadFromLocalStorage();
