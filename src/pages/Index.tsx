import { useState, useCallback } from "react";
import SetupScreen from "@/components/SetupScreen";
import TimerScreen from "@/components/TimerScreen";

const Index = () => {
  const [screen, setScreen] = useState<"setup" | "timer">("setup");
  const [totalSeconds, setTotalSeconds] = useState(0);

  const handleStart = useCallback((seconds: number) => {
    setTotalSeconds(seconds);
    setScreen("timer");
  }, []);

  const handleBack = useCallback(() => {
    setScreen("setup");
  }, []);

  if (screen === "timer") {
    return <TimerScreen key={totalSeconds + "-" + Date.now()} totalSeconds={totalSeconds} onBack={handleBack} />;
  }

  return <SetupScreen onStart={handleStart} />;
};

export default Index;
