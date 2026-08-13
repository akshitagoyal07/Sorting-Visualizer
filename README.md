# Sorting Visualizer

A small web app I built to actually see how sorting algorithms behave instead of just tracing them on paper. You pick an algorithm, hit sort, and watch the bars move — comparisons and swaps are counted live, and the time/space complexity for whatever you've selected shows up below the controls.

Live version: https://akshitagoyal07.github.io/Sorting-Visualizer/

## What's in it

Five algorithms: Bubble, Selection, Insertion, Merge, and Quick Sort. You can change the array size, control the animation speed, and generate a new random array anytime.

## Why I built it

I was going through these algorithms for DSA prep and wanted something more than static code to check my understanding against. Watching Bubble Sort crawl through O(n²) comparisons next to Merge Sort splitting and merging made the complexity difference click in a way that just reading about it didn't.

## Built with

Plain HTML, CSS, and JavaScript. No frameworks — mainly because I wanted to actually understand the DOM manipulation and animation timing myself rather than let a library handle it.

The animations use async/await with a small sleep() helper built on setTimeout and Promises, so each comparison/swap pauses just long enough to be visible instead of finishing instantly.

## Running it

Clone the repo and open index.html in a browser — that's it, no build step.

```
git clone https://github.com/akshitagoyal07/Sorting-Visualizer.git
```

## Author

Akshita Goyal — B.Tech CSE, JECRC Foundation, Jaipur
