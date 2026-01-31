import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import SessionBar from "./SessionBar"
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

  const [sessionElo, setSessionElo] = useState(0);
const [matchHistory, setMatchHistory] = useState<("W" | "L")[]>([]);

  

    useEffect(() => {
    const interval = setInterval(async() => {
      const state = await window.TimerAPI.status();
      setTimerState(state);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  window.electron.onSessionUpdate(({ sessionElo, matchHistory }) => {
    setSessionElo(sessionElo);
    setMatchHistory(matchHistory);
  });
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

 
  const RADIUS = 90;
  const STROKE = 8;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress =
  timerState.durationMs > 0
    ? timerState.remainingMs / timerState.durationMs
    : 0;

  const offset =
  CIRCUMFERENCE * (1 - progress);


  return (
    <>

    <div className="flex flex-col gap-6 items-center justify-center min-h-screen px-6">
      <div>
        <SessionBar
          sessionElo={sessionElo}
          matchHistory={matchHistory}
        />
      </div>
      <div className="relative w-56 h-56 flex items-center justify-center">
  <svg
    className="absolute rotate-[-90deg]"
    width="200"
    height="200"
  >
    
    <circle
      cx="100"
      cy="100"
      r={RADIUS}
      strokeWidth={STROKE}
      stroke="#e5e7eb"
      fill="none"
      className="transition-[stroke-dashoffset] duration-1000 linear"
    />

   
    <circle
      cx="100"
      cy="100"
      r={RADIUS}
      strokeWidth={STROKE}
      stroke="#6366f1"
      fill="none"
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={offset}
      strokeLinecap="round"
    />
  </svg>

  
   <h1>{!timerState.hasStarted || timerState.remainingMs > 0
              ? formatTime(timerState.remainingMs)
              : timerState.state === "finished"
                ? <div className="flex flex-col gap-1 pb-3"><div>{timerState.rankedGamesFinished}</div><div className="text-sm">brawlhalla games</div></div>
                
                : "0:00"
          }</h1>
</div>
      <div>
      <button 
      onClick={() =>{
        if(timerState.state === "paused"){
          resumeTimer();
        }
        else{
          startTimer();
        }
      }}>
      <FaPlay />
      </button>


      <button onClick={stopTimer}><FaPause /></button>
      <button onClick={resetTimer}><IoIosRefresh /></button>
      </div>
      
   


      </div>
      
    </>

    
  )
}

export default App
