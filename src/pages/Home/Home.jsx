import {
  useEffect,
  useRef,
  useState,
} from "react";

import Header from "../../components/Header/Header";
import Timer from "../../components/Timer/Timer";
import Stats from "../../components/Stats/Stats";
import TypingText from "../../components/TypingTest/TypingText";
import TypingInput from "../../components/TypingTest/TypingInput";
import ResultCard from "../../components/ResultCard/ResultCard";

import {
  TEST_DURATIONS,
} from "../../constants/testConfig";

import useTypingTest from "../../hooks/useTypingTest";

import {
  saveResult,
} from "../../services/resultService";

import "./Home.css";

export default function Home() {
  const inputRef = useRef(null);

  const resultSavedRef =
    useRef(false);

  const [
    isSavingResult,
    setIsSavingResult,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

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

  /**
   * Save result exactly once after
   * the test is completed.
   */
  useEffect(() => {
    if (
      !isFinished ||
      resultSavedRef.current
    ) {
      return;
    }

    const saveTypingResult =
      async () => {
        resultSavedRef.current = true;

        setIsSavingResult(true);
        setSaveError("");

        const resultData = {
          wpm,
          accuracy,
          correctCharacters,
          incorrectCharacters,
          duration: elapsedTime,
          passage,
        };

        console.log(
          "Saving typing result:",
          resultData
        );

        try {
          const response =
            await saveResult(
              resultData
            );

          console.log(
            "Typing result saved successfully:",
            response
          );
        } catch (error) {
          console.error(
            "========== SAVE RESULT ERROR =========="
          );

          console.error(
            "Status:",
            error?.response?.status
          );

          console.error(
            "Response:",
            error?.response?.data
          );

          console.error(
            "Message:",
            error?.message
          );

          console.error(
            "======================================="
          );

          resultSavedRef.current =
            false;

          const backendMessage =
            error?.response?.data
              ?.message ||
            error?.response?.data
              ?.detail ||
            error?.response?.data
              ?.error;

          if (backendMessage) {
            setSaveError(
              backendMessage
            );
          } else if (
            error?.response?.status ===
            401
          ) {
            setSaveError(
              "Your session has expired. Please login again."
            );
          } else if (
            error?.response?.status ===
            403
          ) {
            setSaveError(
              "You are not authorized to save this result."
            );
          } else if (
            error?.response?.status ===
            404
          ) {
            setSaveError(
              "Result API endpoint was not found."
            );
          } else if (
            error?.response?.status >=
            500
          ) {
            setSaveError(
              "Server error. Please try again later."
            );
          } else if (
            error?.request
          ) {
            setSaveError(
              "Unable to connect to the server."
            );
          } else {
            setSaveError(
              "Unable to save your typing result."
            );
          }
        } finally {
          setIsSavingResult(false);
        }
      };

    saveTypingResult();
  }, [
    isFinished,
    wpm,
    accuracy,
    correctCharacters,
    incorrectCharacters,
    elapsedTime,
    passage,
  ]);

  const handleRestart = () => {
    resultSavedRef.current = false;

    setIsSavingResult(false);
    setSaveError("");

    restartTest();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="home">
      <div
        className="background-effects"
        aria-hidden="true"
      >
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="grid-overlay" />
      </div>

      <Header />

      <main className="home-container">
        <section className="home-header">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Typing Performance
            </div>

            <h2>
              Test your
              <span>
                {" "}typing speed.
              </span>
            </h2>

            <p>
              Improve your speed, accuracy,
              and confidence with every test.
            </p>
          </div>

          <div className="timer-wrapper">
            <Timer
              timeLeft={timeLeft}
            />
          </div>
        </section>

        <section className="duration-card">
          <div className="duration-info">
            <span className="duration-label">
              Test duration
            </span>

            <span className="duration-description">
              Choose your challenge
            </span>
          </div>

          <div className="duration-selector">
            {TEST_DURATIONS.map(
              (testDuration) => (
                <button
                  key={testDuration}
                  type="button"
                  className={
                    duration ===
                    testDuration
                      ? "duration-button active"
                      : "duration-button"
                  }
                  onClick={() =>
                    changeDuration(
                      testDuration
                    )
                  }
                  disabled={isStarted}
                  aria-pressed={
                    duration ===
                    testDuration
                  }
                >
                  <span>
                    {testDuration}
                  </span>

                  <small>
                    sec
                  </small>
                </button>
              )
            )}
          </div>
        </section>

        <section className="stats-section">
          <Stats
            wpm={wpm}
            accuracy={accuracy}
            correctCharacters={
              correctCharacters
            }
            incorrectCharacters={
              incorrectCharacters
            }
          />
        </section>

        {!isFinished ? (
          <section className="typing-section">
            <div className="typing-card">
              <div className="typing-card-header">
                <div>
                  <span className="typing-label">
                    Typing Test
                  </span>

                  <h3>
                    Type the text below
                  </h3>
                </div>

                <div className="live-indicator">
                  <span />

                  {isStarted
                    ? "Live"
                    : "Ready"}
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
                  <span className="keyboard-icon">
                    ⌨
                  </span>

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
                  <span className="restart-icon">
                    ↻
                  </span>

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
              correctCharacters={
                correctCharacters
              }
              incorrectCharacters={
                incorrectCharacters
              }
              elapsedTime={elapsedTime}
              onRestart={handleRestart}
            />

            <div className="result-save-status">
              {isSavingResult && (
                <span>
                  Saving your result...
                </span>
              )}

              {!isSavingResult &&
                !saveError && (
                  <span>
                    ✓ Result saved successfully
                  </span>
                )}

              {!isSavingResult &&
                saveError && (
                  <span>
                    {saveError}
                  </span>
                )}
            </div>
          </section>
        )}

        <div className="keyboard-hint">
          <span>Tip</span>

          Stay relaxed and focus on accuracy
          before speed.
        </div>
      </main>
    </div>
  );
}