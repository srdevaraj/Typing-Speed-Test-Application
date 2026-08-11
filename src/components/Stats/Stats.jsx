import "./Stats.css";

export default function Stats({
  wpm,
  accuracy,
  correctCharacters,
  incorrectCharacters
}) {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-label">WPM</span>
        <span className="stat-value">{wpm}</span>
      </div>

      <div className="stat">
        <span className="stat-label">Accuracy</span>
        <span className="stat-value">{accuracy}%</span>
      </div>

      <div className="stat">
        <span className="stat-label">Correct</span>
        <span className="stat-value">{correctCharacters}</span>
      </div>

      <div className="stat">
        <span className="stat-label">Errors</span>
        <span className="stat-value">{incorrectCharacters}</span>
      </div>
    </div>
  );
}