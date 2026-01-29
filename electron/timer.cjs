class timer{
    constructor(){
        this.state = "null";
        this.mode = null;
        this.durationMs = 0;
        this.startedAt = null;
        this.pausedAt = null;
        this.totalPausedMs = 0;
        this.rankedGamesFinished = 0;
        this.hasStarted = false;
    }

    startCountdown(minutes){
    if(this.state == "running") return;

    this.state = "running";
    this.mode = "countdown";
    this.durationMs = minutes * 60 * 1000; // 1000ms = 1 second x minutes
    this.startedAt = Date.now();
    this.pausedAt = null;
    this.totalPausedMs = 0;
    this.rankedGamesFinished = 0;
    this.hasStarted = true;
}

pauseCountdown(){
    if(this.state !== "running") return;

    this.state = "paused";
    this.pausedAt = Date.now();

}

resumeCountdown(){
    if(this.state !== "paused") return;

    const pausedDuration = Date.now() - this.pausedAt;
    this.totalPausedMs = this.totalPausedMs + pausedDuration;

    this.pausedAt = null;
    this.state = "running";
}

resetCountdown(){
        this.state = "idle";
        this.mode = null;
        this.durationMs = 0;
        this.startedAt = null;
        this.pausedAt = null;
        this.totalPausedMs = 0;
        this.rankedGamesFinished = 0;
        this.hasStarted = false;
}

getRemainingTime(){
    if(this.state == "idle") return 0;

    const now = Date.now();

    let elapsedMs;
    if(this.state == "paused"){
        elapsedMs = this.pausedAt - this.startedAt - this.totalPausedMs;
    }
    else{
        elapsedMs = now - this.startedAt - this.totalPausedMs;
    }

    const remaining = this.durationMs - elapsedMs;
    return Math.max(0, remaining);
}

checkFinished(){
    return this.getRemainingTime() === 0 && this.state === "running";
}

incrementRankedGames(){
    this.rankedGamesFinished += 1;
    console.log("ITERATED");
    
}

getState() {
    return{
        state: this.state,
        mode: this.mode,
        remainingMs: this.getRemainingTime(),
        rankedGamesFinished: this.rankedGamesFinished,
        hasStarted: this.hasStarted,
    };
}

finishCountdown(){
  if (this.state !== "running") return;

  this.state = "finished";
}

}




module.exports = timer;