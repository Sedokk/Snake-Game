//Начало игры
export default function gameStart({ speed, size, goldenBerry, border }) {
  //Переменные
  const canvas = document.querySelector("#canvas")
  const context = canvas.getContext("2d")
  const countNode = document.getElementById("count")
  const recordCountNode = document.getElementById("record-count")
  const blurBlock = document.querySelector(".canvas__blur")
  const record = localStorage.getItem("record")

  let timer
  let count = 0
  let goldenCount = 0

  const config = {
    cellSize: 20,
    dx: 20,
    dy: 0,
  }
  const snake = {
    x: 120,
    y: 120,
    tails: [],
    maxTails: size,
  }
  const berry = {
    x: 0,
    y: 0,
  }

  //Обновление змейки (её движение в интервале)
  function game() {
    clear()
    snake.x += config.dx
    snake.y += config.dy

    // Поведение змейки у границы
    borderBehavior(border)

    // Змейка врезается в себя
    snake.tails.forEach((e, index) => {
      if (index !== 0 && e.x === snake.x && e.y === snake.y) {
        loose()
        return
      }
    })

    //Змейка съедает ягодку
    if (goldenCount === 10 && goldenIsEaten()) {
      // Золотая ягодка
      snake.maxTails += 4
      count += 4
      goldenCount = 0
      defineBerry()
    } else if (snake.x === berry.x && snake.y === berry.y) {
      // Обычная ягодка
      ++snake.maxTails
      ++count
      if (goldenBerry) ++goldenCount
      if (goldenCount === 10) defineGoldenBerry()
      else defineBerry()
    }

    function goldenIsEaten() {
      //======== Определяем, съедена ли золотая ягодка
      return (
        (snake.x === berry.x || snake.x === berry.x + config.cellSize) &&
        (snake.y === berry.y || snake.y === berry.y + config.cellSize)
      )
    }

    //Удаление и добавление частей змейки, чтобы она двигалась
    snake.tails.unshift({ x: snake.x, y: snake.y })
    if (snake.tails.length > snake.maxTails) snake.tails.pop()

    goldenCount === 10 ? drawGoldenBerry() : drawBerry()

    drawSnake()
    countRender()
  }

  //Отрисовка змейки
  function drawSnake() {
    snake.tails.forEach((e, index) => {
      if (index === 0) context.fillStyle = "green"
      else context.fillStyle = "lightgreen"
      context.fillRect(e.x, e.y, config.cellSize, config.cellSize)
    })
  }

  //Отрисовка ягодки
  function drawBerry() {
    context.fillStyle = "#ff0000"
    context.arc(
      berry.x + config.cellSize / 2,
      berry.y + config.cellSize / 2,
      config.cellSize / 2.5,
      0,
      Math.PI * 2
    )
    context.stroke()
    context.fill()
  }

  //Отрисовка золотой ягодки
  function drawGoldenBerry() {
    context.fillStyle = "#ffd700"
    context.fillRect(berry.x, berry.y, config.cellSize * 2, config.cellSize * 2)
  }

  //Телепортация змейки при пересечении границы поля
  function borderBehavior(border) {
    if (border) {
      ;(snake.x < 0 ||
        snake.x >= canvas.width ||
        snake.y < 0 ||
        snake.y >= canvas.height) &&
        loose()
    } else {
      if (snake.x < 0) {
        snake.x = canvas.width - config.cellSize
      } else if (snake.x >= canvas.width) {
        snake.x = 0
      }
      if (snake.y < 0) {
        snake.y = canvas.height - config.cellSize
      } else if (snake.y >= canvas.height) {
        snake.y = 0
      }
    }
  }

  //Определение случайных координат ягодки
  function defineBerry() {
    berry.x = getRandomNum(0, canvas.width / config.cellSize) * config.cellSize
    berry.y = getRandomNum(0, canvas.height / config.cellSize) * config.cellSize

    snake.tails.forEach((e) => {
      e.x === berry.x && e.y === berry.y && defineBerry()
    })
  }

  // Определение координат золотой ягодки

  function defineGoldenBerry() {
    berry.x =
      getRandomNum(0, canvas.width / config.cellSize - 1) * config.cellSize
    berry.y =
      getRandomNum(0, canvas.height / config.cellSize - 1) * config.cellSize

    snake.tails.forEach((e) => {
      ;(e.x === berry.x || e.x === berry.x + config.cellSize) &&
        (e.y === berry.y || e.y === berry.y + config.cellSize) &&
        defineBerry()
    })
  }

  //Очищение поля (канваса)
  function clear() {
    canvas.width = canvas.width
  }

  //При проигрыше
  function loose() {
    clearInterval(timer)
    blurBlock.classList.remove("hidden")
    if (record < count) {
      localStorage.setItem("record", count)
      recordCountNode.innerText = count
    }
  }

  //Случайное число в диапазоне
  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  //Обновление счёта
  function countRender() {
    countNode.innerText = count
  }

  //Слушатели на клавиши для управления + запрет на разворот змейки на 180
  document.addEventListener("keydown", (e) => {
    if ((e.code === "KeyW" || e.code === "ArrowUp") && config.dy <= 0) {
      config.dx = 0
      config.dy = -config.cellSize
    } else if (
      (e.code === "KeyS" || e.code === "ArrowDown") &&
      config.dy >= 0
    ) {
      config.dx = 0
      config.dy = config.cellSize
    } else if (
      (e.code === "KeyA" || e.code === "ArrowLeft") &&
      config.dx <= 0
    ) {
      config.dx = -config.cellSize
      config.dy = 0
    } else if (
      (e.code === "KeyD" || e.code === "ArrowRight") &&
      config.dx >= 0
    ) {
      config.dx = config.cellSize
      config.dy = 0
    }
  })

  //Вызов координат ягодки и установка интервала ререндеринга
  defineBerry()
  timer = window.setInterval(game, 500 / speed)
}
