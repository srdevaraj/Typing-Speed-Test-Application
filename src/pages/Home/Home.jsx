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
    changeDuration
  } = useTypingTest();

  const handleRestart = () => {
    restartTest();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="home">
      <Header />

      <main className="home-container">
        <div className="home-header">
          <div>
            <h2>Typing Speed Test</h2>
            <p>
              Test your typing speed and accuracy.
            </p>
          </div>

          <Timer timeLeft={timeLeft} />
        </div>

        <div className="duration-selector">
          {TEST_DURATIONS.map((testDuration) => (
            <button
              key={testDuration}
              className={
                duration === testDuration
                  ? "duration-button active"
                  : "duration-button"
              }
              onClick={() => changeDuration(testDuration)}
              disabled={isStarted}
            >
              {testDuration}s
            </button>
          ))}
        </div>

        <Stats
          wpm={wpm}
          accuracy={accuracy}
          correctCharacters={correctCharacters}
          incorrectCharacters={incorrectCharacters}
        />

        {!isFinished ? (
          <div className="typing-test">
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

            <div className="test-actions">
              <span>
                {isStarted
                  ? "Keep typing..."
                  : "Start typing to begin"}
              </span>

              <button onClick={handleRestart}>
                Restart
              </button>
            </div>
          </div>
        ) : (
          <ResultCard
            wpm={wpm}
            accuracy={accuracy}
            correctCharacters={correctCharacters}
            incorrectCharacters={incorrectCharacters}
            elapsedTime={elapsedTime}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}