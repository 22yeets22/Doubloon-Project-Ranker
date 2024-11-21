import { doubloonShop, doubloonImg } from "./constants.js";

let total, totalHours, rate, mean, median, stdev;

function stats() {
  const inputContainer = document.getElementById("input-container");
  const inputSections = Array.from(inputContainer.querySelectorAll(".input-section"));

  const doubloonsArray = inputSections
    .map((section) => parseFloat(section.querySelector(".doubloons").value))
    .filter((value) => !isNaN(value));
  const hoursArray = inputSections
    .map((section) => parseFloat(section.querySelector(".hours").value))
    .filter((value) => !isNaN(value));

  if (doubloonsArray.length === 0 || hoursArray.length === 0) return;

  total = doubloonsArray.reduce((sum, value) => sum + value, 0);
  totalHours = hoursArray.reduce((sum, value) => sum + value, 0);
  mean = total / doubloonsArray.length;
  rate = total / totalHours;

  const sorted = [...doubloonsArray].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const variance =
    doubloonsArray.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    doubloonsArray.length;
  stdev = Math.sqrt(variance);

  document.getElementById("average-rate").innerHTML = `Average Rate: ${rate.toFixed(
    2
  )} ${doubloonImg}/hour`;
  document.getElementById("average-doubloon").innerHTML = `Average: ${mean.toFixed(
    2
  )} ${doubloonImg}/project`;
  document.getElementById("median-doubloon").innerHTML = `Median: ${median.toFixed(
    2
  )} ${doubloonImg}/project`;
  document.getElementById("stdev-doubloon").innerHTML = `Standard Deviation: ${stdev.toFixed(
    2
  )} ${doubloonImg}/project`;
  document.getElementById("stats").style = "visibility: visible;";
}

function clearStats() {
  document.getElementById("stats").style = "visibility: hidden;";
  document.getElementById("time-calculation-result").textContent = "";
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
    doubloonsNeeded = parseFloat(doubloonsInput.value) - total;
  } else if (doubloonDropdown.value in doubloonShop) {
    doubloonsNeeded = doubloonShop[doubloonDropdown.value] - total;
  } else {
    timeCalcResult.innerHTML = `Invalid ${doubloonImg}`;
    return;
  }

  if (doubloonsNeeded <= 0) {
    timeCalcResult.textContent = "You can buy it!";
    return;
  }

  let minTime = doubloonsNeeded / maxRate;
  let maxTime = doubloonsNeeded / minRate;
  let averageTime = doubloonsNeeded / rate;
  timeCalcResult.innerHTML = `From ${minTime.toFixed(2)} hours - ${maxTime.toFixed(
    2
  )} hours<br>Average: ${averageTime.toFixed(2)} hours`;
}

export { stats, clearStats, timeCalculate };
