import "./ResultCard.css";

export default function ResultCard({
  wpm,
  accuracy,
  correctCharacters,
  incorrectCharacters,
  elapsedTime,
  onRestart
}) {
  return (
    <div className="result-card">
      <h2>Test Complete</h2>

      <div className="result-grid">
        <div>
          <span>WPM</span>
          <strong>{wpm}</strong>
        </div>

        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>

        <div>
          <span>Correct</span>
          <strong>{correctCharacters}</strong>
        </div>

        <div>
          <span>Errors</span>
          <strong>{incorrectCharacters}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{elapsedTime}s</strong>
        </div>
      </div>

      <button
        className="restart-button"
        onClick={onRestart}
      >
        Try Again
      </button>
    </div>
  );
}