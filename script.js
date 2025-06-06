let selectedWordData = {};
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrong = 6;
let hintUsed = false;

const wordDisplay = document.getElementById("word");
const lettersContainer = document.getElementById("letters");
const messageEl = document.getElementById("message");
const playAgainBtn = document.getElementById("play-again");
const categoryEl = document.getElementById("category");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");
const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

async function loadWords() {
  const res = await fetch("words.json");
  const words = await res.json();
  return words;
}

function drawGallows() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;

  ctx.beginPath(); ctx.moveTo(10, 240); ctx.lineTo(190, 240); ctx.stroke(); // base
  ctx.beginPath(); ctx.moveTo(50, 240); ctx.lineTo(50, 20); ctx.stroke(); // pole
  ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(150, 20); ctx.stroke(); // top
  ctx.beginPath(); ctx.moveTo(150, 20); ctx.lineTo(150, 50); ctx.stroke(); // rope
}

function drawMan(part) {
  switch (part) {
    case 1: ctx.beginPath(); ctx.arc(150, 70, 20, 0, Math.PI * 2); ctx.stroke(); break;
    case 2: ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(150, 150); ctx.stroke(); break;
    case 3: ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(120, 130); ctx.stroke(); break;
    case 4: ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(180, 130); ctx.stroke(); break;
    case 5: ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(120, 200); ctx.stroke(); break;
    case 6: ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(180, 200); ctx.stroke(); break;
  }
}

function displayWord() {
  wordDisplay.innerHTML = selectedWordData.word
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

function checkWin() {
  if (selectedWordData.word.split("").every(l => guessedLetters.includes(l))) {
    messageEl.textContent = "🎉 You Won!";
    disableAllLetters();
    playAgainBtn.style.display = "inline-block";
  }
}

function checkLose() {
  if (wrongGuesses >= maxWrong) {
    messageEl.textContent = `💀 You Lost! Word was: ${selectedWordData.word}`;
    disableAllLetters();
    playAgainBtn.style.display = "inline-block";
    hintBtn.disabled = true;
  }
}

function disableAllLetters() {
  document.querySelectorAll(".letters button").forEach(btn => btn.disabled = true);
}

function createLetterButtons() {
  lettersContainer.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.addEventListener("click", () => handleGuess(btn));
    lettersContainer.appendChild(btn);
  }
}

function handleGuess(button) {
  const letter = button.textContent.toLowerCase();
  button.disabled = true;

  if (selectedWordData.word.includes(letter)) {
    guessedLetters.push(letter);
    displayWord();
    checkWin();
  } else {
    wrongGuesses++;
    drawMan(wrongGuesses);
    checkLose();
  }
}

function showHint() {
  if (!hintUsed) {
    hintText.textContent = "Hint: " + selectedWordData.hint;
    wrongGuesses++;
    drawMan(wrongGuesses);
    checkLose();
    hintUsed = true;
    hintBtn.disabled = true;
  }
}

async function init() {
  const words = await loadWords();
  selectedWordData = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  wrongGuesses = 0;
  hintUsed = false;

  drawGallows();
  createLetterButtons();
  displayWord();
  messageEl.textContent = "";
  hintText.textContent = "";
  hintBtn.disabled = false;
  playAgainBtn.style.display = "none";
  categoryEl.textContent = `Category: ${selectedWordData.category}`;
}

hintBtn.addEventListener("click", showHint);
playAgainBtn.addEventListener("click", init);
init();
