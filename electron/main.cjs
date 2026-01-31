const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { shell } = require("electron");
const { spawn, exec } = require("child_process")


  
  const pythonprocess = spawn("python", [
  "-u",
  "automation/detect_end_screen.py"
]);


  function handleGameEnded(){
    exec("taskkill /IM Brawlhalla.exe /F");
  };
  
let sessionElo = 0;
let matchHistory = [];

pythonprocess.stdout.on("data", (data) => {
  const output = data.toString().trim();
  console.log("opencv", output);

  let payload;
  try {
    payload = JSON.parse(output);
  } catch {
    return; 
  }

  if (payload.event === "GAME_ENDED") {
    timer.incrementRankedGames();

    sessionElo += payload.elo_change;
    matchHistory.push(payload.result === "WIN" ? "W" : "L");

    if (matchHistory.length > 10) {
      matchHistory.shift();
    }

    if (timer.rankedGamesFinished === 2) {
      handleGameEnded();
      timer.resetCountdown();
    }

    if (mainWindow) {
      mainWindow.webContents.send("session-update", {
        sessionElo,
        matchHistory
      });
    }
  }
});

  pythonprocess.stderr.on("data", (data) => {
  console.error("[OpenCV ERROR]", data.toString());
});

pythonprocess.on("exit", (code) => {
  console.log("[OpenCV] exited with code", code);
});

  const domohalla = require("./timer.cjs");

  const timer = new domohalla();

  ipcMain.handle("timer:start", (_event, minutes) => {
    hasTimerFinished = false;
    timer.rankedGamesFinished = 0;
    timer.startCountdown(minutes);
    return timer.getState();
  })

    ipcMain.handle("timer:stop", () => {
    timer.pauseCountdown();
    return timer.getState();
  })

    ipcMain.handle("timer:resume", () => {
    timer.resumeCountdown();
    return timer.getState();
  })

      ipcMain.handle("timer:reset", () => {
    timer.resetCountdown();
    return timer.getState();
  })

      ipcMain.handle("timer:status", () => {
    return timer.getState();
  })



  let hasTimerFinished = false;

  setInterval(() => {
    const state = timer.getState()
    const isFinished = state.state === "running" && state.remainingMs <= 0 && !hasTimerFinished;

    if(isFinished){
      hasTimerFinished = true;
      
      timer.finishCountdown();

      // shell.openExternal("steam://run/291550");
    }

    if(state.state === "idle"){
      hasTimerFinished = false;
    }

    console.log(
  "state:",
  state.state,
  "remaining:",
  state.remainingMs
);

  }, 1000);



let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

    mainWindow.loadURL("http://localhost:5173");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });


}




app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

