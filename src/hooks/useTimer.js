import {
  useEffect,
  useState,
} from "react";

export default function useTimer(
  duration,
  isRunning,
  onComplete
) {
  const [timeLeft, setTimeLeft] =
    useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);

          onComplete();

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [isRunning, onComplete]);

  return {
    timeLeft,
    elapsedTime:
      duration - timeLeft,
  };
}