import { useState, useEffect, useCallback, useRef } from "react";
import vennLogo from "@/assets/venn-logo.png";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";

type TimerStatus = "ready" | "pre-countdown" | "running" | "paused" | "done";

interface TimerScreenProps {
  totalSeconds: number;
  onBack: () => void;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const formatDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (sec === 0) return `${m} min`;
  return `${m}m ${sec}s`;
};

const beep = (freq = 880, duration = 150) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {}
};

const TimerScreen = ({ totalSeconds, onBack }: TimerScreenProps) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [status, setStatus] = useState<TimerStatus>("ready");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beeped = useRef<Set<number>>(new Set());

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (status === "done") return;
    setStatus("running");
  }, [status]);

  const pause = useCallback(() => {
    setStatus("paused");
    clearTimer();
  }, []);

  const togglePause = useCallback(() => {
    if (status === "running") pause();
    else if (status === "paused" || status === "ready") start();
  }, [status, pause, start]);

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(totalSeconds);
    setStatus("ready");
    beeped.current.clear();
  }, [totalSeconds]);

  // Tick
  useEffect(() => {
    if (status !== "running") return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [status]);

  // Beep at 3, 2, 1
  useEffect(() => {
    if (status === "running" && remaining <= 3 && remaining > 0 && !beeped.current.has(remaining)) {
      beeped.current.add(remaining);
      beep(remaining === 1 ? 1000 : 880, remaining === 1 ? 250 : 150);
    }
  }, [remaining, status]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePause();
      }
      if (e.key === "r" || e.key === "R") reset();
      if (e.key === "m" || e.key === "M") onBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePause, reset, onBack]);

  // Timer visual state
  const getTimerClass = () => {
    if (status === "done") return "timer-done pulse-urgent";
    if (remaining <= 10) return "timer-urgent pulse-urgent";
    if (remaining <= 30) return "timer-warning";
    return "text-foreground timer-glow";
  };

  const statusLabel: Record<TimerStatus, string> = {
    ready: "Ready",
    running: "Running",
    paused: "Paused",
    done: "Time's Up",
  };

  const statusColor: Record<TimerStatus, string> = {
    ready: "text-primary",
    running: "text-primary",
    paused: "text-warning",
    done: "text-urgent",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-scale">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <img src={vennLogo} alt="Venn Innovation" width={56} height={56} className="mb-3" />
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Venn Innovation Pitch
        </h1>
        <p className="text-primary font-semibold text-sm tracking-widest">VIP 2026</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`text-sm font-semibold uppercase tracking-widest ${statusColor[status]}`}>
          {statusLabel[status]}
        </span>
        <span className="text-muted-foreground text-sm">·</span>
        <span className="text-muted-foreground text-sm">
          Set: {formatDuration(totalSeconds)}
        </span>
      </div>

      {/* Timer */}
      <div className={`timer-digit text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none select-none transition-colors duration-500 ${getTimerClass()}`}>
        {status === "done" ? "00:00" : formatTime(remaining)}
      </div>

      {status === "done" && (
        <p className="text-urgent text-3xl md:text-5xl font-bold mt-4 pulse-urgent tracking-wide">
          Time's Up!
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 mt-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-base transition-all duration-200 hover:bg-secondary/80 active:scale-95"
        >
          <ArrowLeft size={20} />
          Menu
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-base transition-all duration-200 hover:bg-secondary/80 active:scale-95"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        {status !== "done" && (
          <button
            onClick={togglePause}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          >
            {status === "running" ? <Pause size={22} /> : <Play size={22} />}
            {status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start"}
          </button>
        )}
      </div>

      {/* Keyboard hints */}
      <p className="mt-8 text-xs text-muted-foreground">
        Space = pause/resume · R = reset · M = menu
      </p>
    </div>
  );
};

export default TimerScreen;
