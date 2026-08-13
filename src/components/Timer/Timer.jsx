import {
  useEffect,
  useState,
} from "react";

import "./Timer.css";

export default function Timer({
  timeLeft,
  totalTime = 60,
  isStarted = false,
}) {
  const [isTicking, setIsTicking] =
    useState(false);

  /*
   * Trigger a small animation whenever
   * the remaining time changes.
   */
  useEffect(() => {
    if (!isStarted) {
      return;
    }

    setIsTicking(true);

    const animationTimer =
      window.setTimeout(() => {
        setIsTicking(false);
      }, 280);

    return () => {
      window.clearTimeout(
        animationTimer
      );
    };
  }, [timeLeft, isStarted]);

  /*
   * Calculate remaining percentage.
   */
  const progress =
    totalTime > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (timeLeft / totalTime) * 100
          )
        )
      : 0;

  /*
   * Timer states.
   */
  const isWarning =
    timeLeft <= 10 &&
    timeLeft > 5;

  const isCritical =
    timeLeft <= 5;

  let timerState = "normal";

  if (isCritical) {
    timerState = "critical";
  } else if (isWarning) {
    timerState = "warning";
  }

  return (
    <div
      className={`timer timer-${timerState} ${
        isStarted
          ? "timer-started"
          : "timer-idle"
      }`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${timeLeft} seconds remaining`}
    >
      {/* =================================================
          ICON
      ================================================= */}

      <div className="timer-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="13"
            r="7.5"
          />

          <path
            d="M12 9v4l2.5 1.5"
          />

          <path
            d="M9.5 3.5h5"
          />

          <path
            d="M12 3.5V2"
          />
        </svg>
      </div>

      {/* =================================================
          TIME CONTENT
      ================================================= */}

      <div className="timer-content">

        <span className="timer-label">
          TIME
        </span>

        <div
          className={`timer-value ${
            isTicking
              ? "timer-value-tick"
              : ""
          }`}
        >
          <span className="timer-number">
            {timeLeft}
          </span>

          <span className="timer-unit">
            sec
          </span>
        </div>

      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div
        className="timer-progress"
        aria-hidden="true"
      >
        <div className="timer-progress-track">

          <div
            className="timer-progress-value"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>
      </div>
    </div>
  );
}