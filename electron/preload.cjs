const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ PRELOAD SCRIPT LOADED");

contextBridge.exposeInMainWorld("TimerAPI", {
    start: (minutes) => ipcRenderer.invoke("timer:start", minutes),
    stop: () => ipcRenderer.invoke("timer:stop"),
    resume: () => ipcRenderer.invoke("timer:resume"),
    reset: () => ipcRenderer.invoke("timer:reset"),
    status: () => ipcRenderer.invoke("timer:status"),
});