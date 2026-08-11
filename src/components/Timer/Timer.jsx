import "./Timer.css";

export default function Timer({ timeLeft }) {
  return (
    <div className="timer">
      <span className="timer-label">Time</span>

      <span className="timer-value">
        {timeLeft}s
      </span>
    </div>
  );
}