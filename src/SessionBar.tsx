type SessionBarProps = {
  sessionElo: number;
  matchHistory: ("W" | "L")[];
};

export default function SessionBar({
  sessionElo,
  matchHistory,
}: SessionBarProps) {
  return (
    <div className="w-full flex items-center justify-between px-6 py-2 gap-2">
     
      <div className="flex items-center gap-2">
        {matchHistory.map((result, index) => (
          <span
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-transform duration-200 ${
              result === "W"
                ? "bg-emerald-400"
                : "bg-red-400"
            }`}
          />
        ))}
      </div>

     
      <div
        className={`text-sm font-semibold tabular-nums transition-colors duration-200 ${
          sessionElo >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {sessionElo >= 0 ? "+" : ""}
        {sessionElo}
      </div>
    </div>
  );
}
