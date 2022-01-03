import { useState, useEffect } from "react";
import ScoreBoard from './components/Scoreboard'
import blueCandy from './images/blue-crush.png'
import greenCandy from './images/green-crush.png'
import orangeCandy from './images/orange-crush.png'
import purpleCandy from './images/purple-crush.png'
import redCandy from './images/red-crush.png'
import yellowCandy from './images/yellow-crush.png'
import blank from './images/blank-crush.png'

const width = 8;
const candyColors = [blueCandy, greenCandy ,orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [ currentColorArr, setCurrentColorArr] = useState([]);
  const [ squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [ squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === blank

      if (
        columnOfFour.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4)
        columnOfFour.forEach((square) => (currentColorArr[square] = blank))
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArr[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArr[i] === blank

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        rowOfFour.forEach((square) => (currentColorArr[square] = blank))
        setScoreDisplay((score) => score + 4)
        return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === blank

      if (
        columnOfThree.every(
          (square) => currentColorArr[square] === decidedColor && !isBlank
        )
      ) {
        columnOfThree.forEach((square) => (currentColorArr[square] = blank))
        setScoreDisplay((score) => score + 3)
        return true
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArr[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArr[i] === blank

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        rowOfThree.forEach((square) => (currentColorArr[square] = blank))
        setScoreDisplay((score) => score + 3)
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArr[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArr[i] = candyColors[randomNumber]
      }
      if (currentColorArr[i + width] === blank) {
        currentColorArr[i + width] = currentColorArr[i];
        currentColorArr[i] = blank;
      }
    }
  };

  console.log(scoreDisplay)

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = () => {

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArr[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArr[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId && validMove && (isARowOfThree || isAColumnOfFour || isARowOfFour || isAColumnOfThree)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArr[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArr[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrentColorArr([...currentColorArr])
    }
  }

  const createBoard = () => {
    const randomColorArr = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArr.push(randomColor);
    }
    setCurrentColorArr(randomColorArr);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArr([...currentColorArr]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArr,
  ]);

  // console.log(currentColorArr)

  return (
    <div className="app">
      <div className="game">
        {currentColorArr.map((candyColor, index: number) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e :DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragEnter={(e :DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragLeave={(e :DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
