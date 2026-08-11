import { useRef } from "react";

import Header from "../../components/Header/Header";
import Timer from "../../components/Timer/Timer";
import Stats from "../../components/Stats/Stats";
import TypingText from "../../components/TypingTest/TypingText";
import TypingInput from "../../components/TypingTest/TypingInput";
import ResultCard from "../../components/ResultCard/ResultCard";

import { TEST_DURATIONS } from "../../constants/testConfig";
import useTypingTest from "../../hooks/useTypingTest";

import "./Home.css";

export default function Home() {
  const inputRef = useRef(null);

  const {
    passage,
    typedText,
    duration,
    timeLeft,
    elapsedTime,
    isStarted,
    isFinished,
    correctCharacters,
    incorrectCharacters,
    wpm,
    accuracy,
    handleTyping,
    restartTest,
    changeDuration,
  } = useTypingTest();

  const handleRestart = () => {
    restartTest();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="home">
      {/* Animated background */}
      <div className="background-effects" aria-hidden="true">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>
        <div className="grid-overlay"></div>
      </div>

      <Header />

      <main className="home-container">
        {/* Hero section */}
        <section className="home-header">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Typing Performance
            </div>

            <h2>
              Test your
              <span> typing speed.</span>
            </h2>

            <p>
              Improve your speed, accuracy, and confidence with every test.
            </p>
          </div>

          <div className="timer-wrapper">
            <Timer timeLeft={timeLeft} />
          </div>
        </section>

        {/* Duration selector */}
        <section className="duration-card">
          <div className="duration-info">
            <span className="duration-label">Test duration</span>
            <span className="duration-description">
              Choose your challenge
            </span>
          </div>

          <div className="duration-selector">
            {TEST_DURATIONS.map((testDuration) => (
              <button
                key={testDuration}
                type="button"
                className={
                  duration === testDuration
                    ? "duration-button active"
                    : "duration-button"
                }
                onClick={() => changeDuration(testDuration)}
                disabled={isStarted}
                aria-pressed={duration === testDuration}
              >
                <span>{testDuration}</span>
                <small>sec</small>
              </button>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-section">
          <Stats
            wpm={wpm}
            accuracy={accuracy}
            correctCharacters={correctCharacters}
            incorrectCharacters={incorrectCharacters}
          />
        </section>

        {/* Typing area */}
        {!isFinished ? (
          <section className="typing-section">
            <div className="typing-card">
              <div className="typing-card-header">
                <div>
                  <span className="typing-label">Typing Test</span>
                  <h3>Type the text below</h3>
                </div>

                <div className="live-indicator">
                  <span></span>
                  {isStarted ? "Live" : "Ready"}
                </div>
              </div>

              <div className="typing-content">
                <TypingText
                  passage={passage}
                  typedText={typedText}
                />

                <TypingInput
                  inputRef={inputRef}
                  value={typedText}
                  onChange={handleTyping}
                  disabled={isFinished}
                />
              </div>

              <div className="test-actions">
                <div className="typing-status">
                  <span className="keyboard-icon">⌨</span>

                  <span>
                    {isStarted
                      ? "Keep typing..."
                      : "Start typing to begin"}
                  </span>
                </div>

                <button
                  type="button"
                  className="restart-button"
                  onClick={handleRestart}
                >
                  <span className="restart-icon">↻</span>
                  Restart
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="result-section">
            <ResultCard
              wpm={wpm}
              accuracy={accuracy}
              correctCharacters={correctCharacters}
              incorrectCharacters={incorrectCharacters}
              elapsedTime={elapsedTime}
              onRestart={handleRestart}
            />
          </section>
        )}

        {/* Footer hint */}
        <div className="keyboard-hint">
          <span>Tip</span>
          Stay relaxed and focus on accuracy before speed.
        </div>
      </main>
    </div>
  );
}