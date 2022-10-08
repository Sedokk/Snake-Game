import gameStart from "./game.js"

let config = {
  speed: 10,
  size: 3,
  border: false,
  goldenBerry: false,
}

// Game start =================================
const blurBlock = document.querySelector(".canvas__blur")
const startBtn = blurBlock.querySelector(".canvas__btn")
const record = localStorage.getItem("record")
const recordCountNode = document.getElementById("record-count")
const modal = document.querySelector(".modal")
const modalOpenBtn = document.querySelector(".modal__open")
const modalCloseBtn = modal.querySelector(".modal__close")

if (record) recordCountNode.innerText = record

startBtn.addEventListener("click", () => {
  blurBlock.classList.add("hidden")
  gameStart(config)
})

// Modal ==================================
modalOpenBtn.addEventListener("click", () => {
  modal.classList.add("open")
  window.addEventListener("click", modalClose)
})
modalCloseBtn.addEventListener("click", () => {
  modal.classList.remove("open")
})

function modalClose(ev) {
  ev.stopPropagation()
  if (!ev.target.classList.contains("modal")) return
  ev.target.classList.remove("open")
  window.removeEventListener("click", modalClose)
}

//Sliders in modal =========================
const speedSlider = modal.querySelector("#slider1")
noUiSlider.create(speedSlider, {
  start: 10,
  step: 1,
  range: {
    min: 1,
    max: 10,
  },
})

const sizeSlider = modal.querySelector("#slider2")
noUiSlider.create(sizeSlider, {
  start: 3,
  step: 1,
  range: {
    min: 3,
    max: 10,
  },
})

const speedResult = modal.querySelector(".result__speed")
const sizeResult = modal.querySelector(".result__size")

speedResult.innerText = speedSlider.noUiSlider.get(true)
speedSlider.noUiSlider.on("update", (values, handler) => {
  speedResult.innerText = values[handler]
})

sizeResult.innerText = sizeSlider.noUiSlider.get(true)
sizeSlider.noUiSlider.on("update", (values, handler) => {
  sizeResult.innerText = values[handler]
})

// Radio buttons =====================
const form = modal.querySelector(".modal__form")

form.border.forEach((e) => {
  e.addEventListener("change", (ev) => {
    form.border.forEach((e) => e.closest("label").classList.remove("checked"))
    ev.target.closest("label").classList.add("checked")
  })
})

form.golden.forEach((e) => {
  e.addEventListener("change", (ev) => {
    form.golden.forEach((e) => e.closest("label").classList.remove("checked"))
    ev.target.closest("label").classList.add("checked")
  })
})

// Config ========================

form.addEventListener("submit", createConfig)

function createConfig(ev) {
  ev.preventDefault()
  const speed = speedSlider.noUiSlider.get(true)
  const size = sizeSlider.noUiSlider.get(true)
  const goldenBerry = !!form.golden.value
  const border = !!form.border.value
  config = {
    speed,
    size,
    goldenBerry,
    border,
  }
  modal.classList.remove("open")
  console.log(config)
}
