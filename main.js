import gameStart from "./game.js"

const blurBlock = document.querySelector(".canvas__blur")
const startBtn = blurBlock.querySelector(".canvas__btn")
const record = localStorage.getItem("record")
const recordCountNode = document.getElementById("record-count")

if (record) recordCountNode.innerText = record

startBtn.addEventListener("click", (e) => {
  blurBlock.classList.add("hidden")
  gameStart()
})
