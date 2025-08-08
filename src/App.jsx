import React, { useEffect, useState } from "react";
import Confetti from 'react-confetti';
import useWindowSize from "react-use/lib/useWindowSize";

function App() {
  const {width,height}=useWindowSize();
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  
  const [hasWon, setHasWon] = useState(false);

  useEffect(()=>{
    if(!hasWon && checkWin(tiles)){
      setHasWon(true);
      const audio = new Audio("/win.wav");
      audio.play();
      setIsRunning(false);
      
    }
  });

  function isSolvable(arr) {
    const inversionCount = countInversions(arr);
    const emptyIndex = arr.indexOf(null);
    const rowFromBottom = 4 - Math.floor(emptyIndex / 4);

    if (rowFromBottom % 2 === 0) {
      return inversionCount % 2 === 1;
    } else {
      return inversionCount % 2 === 0;
    }
  }

  function checkWin(tiles) {
   const correctOrder=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,null]; 
   return tiles.every((tile,index)=> tile === correctOrder[index]);
  }

  function countInversions(arr) {
    const nums = arr.filter((n) => n !== null);
    let count = 0;

    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) {
          count++;
        }
      }
    }

    return count;
  }

  function handleResetClick() {
    const array = generateShuffledArray;
    setTiles(array);
    setMoves(0);
    setIsRunning(false);
    setTime(0);
    setHasWon(false);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function generateShuffledArray() {
    let arr;
    do {
      arr = [
        ...Array(15)
          .keys()
          .map((n) => n + 1),
      ];
      arr.push(null);
      arr = shuffle(arr);
    } while (!isSolvable(arr));
    return arr;
  }

  function handleTileClick(index) {
    const jumpAudio=new Audio('/jump.wav');
    
    const emptyIndex = tiles.indexOf(null);
    const isAbove = index === emptyIndex - 4;
    const isBelow = index === emptyIndex + 4;

    const sameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);
    const isLeft = index === emptyIndex - 1 && sameRow;
    const isRight = index === emptyIndex + 1 && sameRow;
    

    if ((isAbove || isBelow || isLeft || isRight) && !hasWon) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      jumpAudio.play();
      setIsRunning(true);
      setTiles(newTiles);
      setMoves(moves + 1);

    }

    
  }

  const [tiles, setTiles] = useState(generateShuffledArray);
  return (
    <div className="h-screen flex flex-col w-screen items-center justify-center">
      {hasWon && (
        <>
          <Confetti width={width} height={height} />
          <h1 style={{ color: "gold", fontSize: "3rem" }}>🎉 You Win! 🎉</h1>
        </>
      )}
      <div className="flex flex-col items-center gap-10 border-4 border-double border-yellow-300 w-[275px] h-[500px] rounded-[35px] place-self-center  justify-center">
        <h1 className="text-3xl font-bold">15 Puzzel Game</h1>
        <div className=" game-container flex flex-col justify-center">
          <div className="flex justify-between mb-3">
            <h1 className="font-medium">Time : {time} s</h1>
            <h1 className="font-medium">Moves : {moves}</h1>
          </div>
          <div className="grid grid-cols-4 border w-[220px]">
            {tiles.map((value, index) => (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                className={`w-14 h-14 border text-xl font-bold transition-all duration-300 ${
                  value === index + 1
                    ? "bg-green-300 border-green-500 shadow-md shadow-green-500"
                    : "bg-white border-black"
                }`}
              >
                {value !== null ? value : ""}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            handleResetClick();
          }}
          className="active:bg-red-600 active:h-9 active:w-[80px] active:mt-1 border-2 w-[85px] h-10 place-self-center rounded-full bg-red-500 font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
