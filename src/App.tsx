import { useState, useEffect, useRef } from 'react'

import './App.css'

function formatTime(ms){
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds/60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2,0)}`;
}

function App() {
  const [timerState, setTimerState] = useState({
    state: "idle",
    mode: null,
    remainingMs: 0,
    rankedGamesFinished: 0,
  }); 





    useEffect(() => {
    const interval = setInterval(async() => {
      const state = await window.TimerAPI.status();
      setTimerState(state);
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  const startTimer = async() => {
    await window.TimerAPI.start(0.05);
  }

   const stopTimer = async() => {
    await window.TimerAPI.stop();
  }

     const resumeTimer = async() => {
    await window.TimerAPI.resume();
  }

     const resetTimer = async() => {
    await window.TimerAPI.reset();
  }


  return (
    <>
      <h1>{!timerState.hasStarted || timerState.remainingMs > 0
              ? formatTime(timerState.remainingMs)
              : timerState.state === "finished"
                ? timerState.rankedGamesFinished
                : "0:00"
          }</h1>

      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resumeTimer}>Resume</button>
      <button onClick={resetTimer}>Reset</button>
    </>
  )
}

export default App
