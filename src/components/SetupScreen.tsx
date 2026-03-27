import { useState } from "react";
import vennLogo from "@/assets/venn-logo.png";

const PRESETS = [
  { label: "1 min", minutes: 1, seconds: 0 },
  { label: "3 min", minutes: 3, seconds: 0 },
  { label: "5 min", minutes: 5, seconds: 0 },
  { label: "10 min", minutes: 10, seconds: 0 },
];

interface SetupScreenProps {
  onStart: (totalSeconds: number) => void;
}

const SetupScreen = ({ onStart }: SetupScreenProps) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const handlePreset = (m: number, s: number) => {
    setMinutes(m);
    setSeconds(s);
  };

  const handleStart = () => {
    const total = minutes * 60 + seconds;
    if (total > 0) onStart(total);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-up">
      <img src={vennLogo} alt="Venn Innovation" width={140} height={140} className="mb-6 logo-glow" />
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight text-center">
        Venn Innovation Pitch
      </h1>
      <p className="text-primary font-semibold text-lg mb-10 tracking-wide">VIP 2026</p>

      <div className="card-glass p-8 md:p-10 w-full max-w-md space-y-8">
        <h2 className="text-xl font-semibold text-foreground text-center">Set Duration</h2>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-3">
          {PRESETS.map((p) => {
            const isActive = minutes === p.minutes && seconds === p.seconds;
            return (
              <button
                key={p.label}
                onClick={() => handlePreset(p.minutes, p.seconds)}
                className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Manual input */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm text-muted-foreground">Minutes</label>
            <input
              type="number"
              min={0}
              max={99}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              className="w-20 h-14 text-center text-2xl font-mono font-bold bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <span className="text-3xl font-bold text-muted-foreground mt-6">:</span>
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm text-muted-foreground">Seconds</label>
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-20 h-14 text-center text-2xl font-mono font-bold bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={minutes * 60 + seconds === 0}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg tracking-wide transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          Start Timer
        </button>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Space to pause · R to reset · M for menu
      </p>
    </div>
  );
};

export default SetupScreen;
