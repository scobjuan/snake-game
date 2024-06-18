import "./style.css";

const scene: HTMLCanvasElement = document.getElementById(
  "scene"
) as HTMLCanvasElement;
const context = scene.getContext("2d");

scene.width = 448;
scene.height = 400;

let hasNotLost = true
let snakeSize = 200
const positions = [{x: 0, y: 0}]
const positionsFood = {
	x: 0,
	y: 0
}

const velocities = {
	x: 0,
	y: 2
}

const drawSnake = () => {
	if (!context) return

	context.beginPath()

	positions.forEach((currentElement) => {
		context.rect(currentElement.x, currentElement.y, 5, 5)
	})

	// context.rect(positions[0].x, positions[0].y, 5, 5)
	context.fillStyle = '#ffffff'
	context.fill()
	context.closePath()
}

const randomFoodPositions = () => {
	if (positionsFood.x > 0 || positionsFood.y > 0) return 

	positionsFood.x = Math.floor(Math.random() * 448)
	positionsFood.y = Math.floor(Math.random() * 400)
}

const drawFood = () => {
	if (!context) return
	
	randomFoodPositions()

	context.beginPath()
	context.rect(positionsFood.x, positionsFood.y, 5, 5)
	context.fillStyle = "#ffffff"
	context.fill()
	context.closePath()	
}

const snakeMovement = () => {
  for (let i = snakeSize; i > 0; i--) {
    positions[i] = {...positions[i - 1]}
  }

  positions[0].x += velocities.x
  positions[0].y += velocities.y
	// positions.forEach((currentElement, index) => {
	// 	positions[index].x += velocities.x
	// 	positions[index].y += velocities.y
	// })
}

const checkBorderCollition = () => {
	if (positions[0].x > scene.width || positions[0].x < 0) {
		console.error('Haz perdido!')
		// window.location.reload()
    hasNotLost = false
	}

	if (positions[0].y > scene.height || positions[0].y < 0) {
		console.error('Haz perdido!')
		// window.location.reload()
    hasNotLost = false
	}
}

const checkSnakeCollitionWithFood = () => {
	const positionsOnX = (positions[0].x >= (positionsFood.x - 5)) && (positions[0].x <= (positionsFood.x + 5))
	const positionsOnY = (positions[0].y >= (positionsFood.y - 5)) && (positions[0].y <= (positionsFood.y + 5))

	if (positionsOnX && positionsOnY) {
		const newPosition = { x: 0, y: 0 }
		if (velocities.x) {
			newPosition.x = positions[0].x + 5
			newPosition.y = positions[0].y
		}
		else if (!velocities.x) {
			newPosition.x = positions[0].x - 5
			newPosition.y = positions[0].y
		}
		else if (velocities.y) {
			newPosition.y = positions[0].y + 5
			newPosition.x = positions[0].x
		}
		else if (!velocities.y) {
			newPosition.y = positions[0].y - 5
			newPosition.x = positions[0].x
		}
	
		positions.push(newPosition)
		positionsFood.x = 0
		positionsFood.y = 0

    snakeSize += 1
	}
}

const checkSnakeCollitionWithHerself = () => {
  const isAvailablePosition = positions.forEach((val, index) => {
    if (index === 0) return
     if (val.x === positions[0].x && val.y === positions[0].y) {
       console.error('Haz perdido')
        hasNotLost = false
     }
  })
}

const onPressKey = () => {
	document.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'ArrowLeft':
				velocities.x = -2
				velocities.y = 0
				break;
			case 'ArrowRight':
				velocities.x = 2
				velocities.y = 0
				break;
			case 'ArrowUp':
				velocities.x = 0
				velocities.y = -2
				break;
			case 'ArrowDown':
				velocities.x = 0
				velocities.y = 2
				break;
			default:

				break;
		}
	})
}

const cleanCanvas = () => {
  // Clean the canvas from to since
  context?.clearRect(0, 0, scene.width, scene.height);
};

const draw = () => {
  cleanCanvas();
	drawSnake()
	drawFood();
  checkSnakeCollitionWithHerself()
	snakeMovement()
	checkBorderCollition()
	checkSnakeCollitionWithFood()

  // This function execute as a bucle the draw function thanks to the synchronization with the screen refresh
  if (hasNotLost) {
    window.requestAnimationFrame(draw);
  } else {
    window.location.reload()
  }
};

draw();
onPressKey()
