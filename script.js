// ---------- Grab references to all the HTML elements we need ----------
const barsContainer = document.getElementById("barsContainer");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const algoSelect = document.getElementById("algoSelect");
const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");
const comparisonCountEl = document.getElementById("comparisonCount");
const swapCountEl = document.getElementById("swapCount");

// ---------- State: the actual array of numbers we're sorting ----------
let array = [];
let comparisons = 0;
let swaps = 0;
let isSorting = false; // prevents clicking "sort" twice at once

// ---------- Generate a random array and draw it as bars ----------
function generateArray() {
  if (isSorting) return; // don't let the user reset mid-sort

  const size = parseInt(sizeSlider.value);
  array = [];
  for (let i = 0; i < size; i++) {
    // random value between 5 and 100, just for bar height
    array.push(Math.floor(Math.random() * 96) + 5);
  }

  comparisons = 0;
  swaps = 0;
  comparisonCountEl.textContent = 0;
  swapCountEl.textContent = 0;

  renderBars();
}

// ---------- Draw the current array as bars in the DOM ----------
function renderBars() {
  barsContainer.innerHTML = ""; // clear old bars first

  const barWidth = 100 / array.length; // percentage width per bar

  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 3}px`;   // scale value into pixels
    bar.style.width = `${barWidth}%`;
    barsContainer.appendChild(bar);
  });
}

// A small delay function we'll use to control animation speed.
// Higher speed slider value = shorter delay = faster sorting.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDelay() {
  // Invert the slider: high speed value should mean LOW delay
  return 210 - speedSlider.value * 2;
}

// ---------- Helper: update a single bar's height + color ----------
function getBarElements() {
  return barsContainer.children; // live list of all bar <div>s, in order
}

function markComparing(...indices) {
  const bars = getBarElements();
  indices.forEach((i) => bars[i].classList.add("comparing"));
}

function unmarkComparing(...indices) {
  const bars = getBarElements();
  indices.forEach((i) => bars[i].classList.remove("comparing"));
}

function markSorted(i) {
  getBarElements()[i].classList.add("sorted");
}

function updateBarHeight(i, value) {
  getBarElements()[i].style.height = `${value * 3}px`;
}

function incrementComparisons() {
  comparisons++;
  comparisonCountEl.textContent = comparisons;
}

function incrementSwaps() {
  swaps++;
  swapCountEl.textContent = swaps;
}

// ---------- BUBBLE SORT ----------
// Repeatedly compare neighbors, swap if out of order.
// Largest unsorted element "bubbles" to the end each pass.
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      markComparing(j, j + 1);
      incrementComparisons();
      await sleep(getDelay());

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]]; // swap
        updateBarHeight(j, array[j]);
        updateBarHeight(j + 1, array[j + 1]);
        incrementSwaps();
      }

      unmarkComparing(j, j + 1);
    }
    markSorted(n - i - 1); // last element of this pass is now in place
  }
  markSorted(0);
}

// ---------- SELECTION SORT ----------
// Find the minimum in the unsorted portion, swap it to the front.
async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    markComparing(i);
    for (let j = i + 1; j < n; j++) {
      markComparing(minIdx, j);
      incrementComparisons();
      await sleep(getDelay());
      if (array[j] < array[minIdx]) {
        unmarkComparing(minIdx);
        minIdx = j;
      } else {
        unmarkComparing(j);
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      updateBarHeight(i, array[i]);
      updateBarHeight(minIdx, array[minIdx]);
      incrementSwaps();
    }
    unmarkComparing(minIdx);
    markSorted(i);
  }
}

// ---------- INSERTION SORT ----------
// Build the sorted portion one element at a time, shifting larger
// elements right to make room.
async function insertionSort() {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    markComparing(i);
    while (j >= 0 && array[j] > key) {
      markComparing(j, j + 1);
      incrementComparisons();
      await sleep(getDelay());

      array[j + 1] = array[j];
      updateBarHeight(j + 1, array[j + 1]);
      incrementSwaps();
      unmarkComparing(j, j + 1);
      j--;
    }
    array[j + 1] = key;
    updateBarHeight(j + 1, key);
  }
  for (let i = 0; i < n; i++) markSorted(i);
}

// ---------- MERGE SORT ----------
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    markComparing(k);
    incrementComparisons();
    await sleep(getDelay());

    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    updateBarHeight(k, array[k]);
    incrementSwaps();
    unmarkComparing(k);
    k++;
  }
  while (i < left.length) {
    array[k] = left[i++];
    updateBarHeight(k, array[k]);
    k++;
  }
  while (j < right.length) {
    array[k] = right[j++];
    updateBarHeight(k, array[k]);
    k++;
  }
  for (let x = start; x <= end; x++) markSorted(x);
}

// ---------- QUICK SORT ----------
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) {
    if (start >= 0 && start < array.length) markSorted(start);
    return;
  }
  const pivotIndex = await partition(start, end);
  await quickSort(start, pivotIndex - 1);
  await quickSort(pivotIndex + 1, end);
}

async function partition(start, end) {
  const pivot = array[end];
  markComparing(end);
  let i = start - 1;

  for (let j = start; j < end; j++) {
    markComparing(j, end);
    incrementComparisons();
    await sleep(getDelay());

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      updateBarHeight(i, array[i]);
      updateBarHeight(j, array[j]);
      incrementSwaps();
    }
    unmarkComparing(j, end);
  }
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  updateBarHeight(i + 1, array[i + 1]);
  updateBarHeight(end, array[end]);
  incrementSwaps();
  markSorted(i + 1);
  return i + 1;
}

// ---------- Run whichever algorithm is selected ----------
async function startSort() {
  if (isSorting) return;
  isSorting = true;
  sortBtn.disabled = true;
  generateBtn.disabled = true;
  sizeSlider.disabled = true;

  const algo = algoSelect.value;
  if (algo === "bubble") await bubbleSort();
  else if (algo === "selection") await selectionSort();
  else if (algo === "insertion") await insertionSort();
  else if (algo === "merge") await mergeSort();
  else if (algo === "quick") await quickSort();

  isSorting = false;
  sortBtn.disabled = false;
  generateBtn.disabled = false;
  sizeSlider.disabled = false;
}

// ---------- Complexity data ----------
// A plain object acting as a lookup table: algorithm name -> its complexities.
// This is the JS equivalent of a std::map<string, struct> in C++.
const complexityData = {
  bubble: {
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  selection: {
    best: "O(n²)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  insertion: {
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  merge: {
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  quick: {
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)", // average-case recursion depth; worst case is O(n)
  },
};

const timeBestEl = document.getElementById("timeBest");
const timeAvgEl = document.getElementById("timeAvg");
const timeWorstEl = document.getElementById("timeWorst");
const spaceComplexityEl = document.getElementById("spaceComplexity");

function updateComplexityDisplay() {
  const data = complexityData[algoSelect.value];
  timeBestEl.textContent = data.best;
  timeAvgEl.textContent = data.avg;
  timeWorstEl.textContent = data.worst;
  spaceComplexityEl.textContent = data.space;
}

// ---------- Hook up buttons ----------
generateBtn.addEventListener("click", generateArray);
sizeSlider.addEventListener("input", generateArray);
sortBtn.addEventListener("click", startSort);
algoSelect.addEventListener("change", updateComplexityDisplay);

// Generate the first array and show its complexity as soon as the page loads
generateArray();
updateComplexityDisplay();
