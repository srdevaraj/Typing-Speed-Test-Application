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

import { TEST_DURATIONS } from "../../constants/testConfig";

import useTypingTest from "../../hooks/useTypingTest";

import { saveResult } from "../../services/resultService";

import "./Home.css";

export default function Home() {
  const inputRef = useRef(null);
  const resultSavedRef = useRef(false);

  const [isSavingResult, setIsSavingResult] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

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

  /*
   * -------------------------------------------------------
   * SAVE RESULT
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (
      !isFinished ||
      resultSavedRef.current
    ) {
      return;
    }

    const saveTypingResult = async () => {
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

      try {
        await saveResult(resultData);
      } catch (error) {
        /*
         * Allow another attempt if saving failed.
         */
        resultSavedRef.current = false;

        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.response?.data?.error;

        if (backendMessage) {
          setSaveError(backendMessage);
        } else if (
          error?.response?.status === 401
        ) {
          setSaveError(
            "Your session has expired. Please login again."
          );
        } else if (
          error?.response?.status === 403
        ) {
          setSaveError(
            "You are not authorized to save this result."
          );
        } else if (
          error?.response?.status === 404
        ) {
          setSaveError(
            "Result API endpoint was not found."
          );
        } else if (
          error?.response?.status >= 500
        ) {
          setSaveError(
            "Server error. Please try again later."
          );
        } else if (error?.request) {
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

  /*
   * -------------------------------------------------------
   * RESTART
   * -------------------------------------------------------
   */

  const handleRestart = () => {
    resultSavedRef.current = false;

    setIsSavingResult(false);
    setSaveError("");

    restartTest();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  /*
   * -------------------------------------------------------
   * DURATION CHANGE
   * -------------------------------------------------------
   */

  const handleDurationChange = (testDuration) => {
    if (isStarted) {
      return;
    }

    setSaveError("");

    changeDuration(testDuration);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div className="home">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="background-effects"
        aria-hidden="true"
      >
        <div className="background-glow background-glow-one" />

        <div className="background-glow background-glow-two" />

        <div className="background-grid" />

        <div className="background-noise" />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="home-container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="home-header">
          <div className="hero-content">

            <div className="hero-badge">
              <span className="hero-badge-indicator" />

              <span>
                Typing Performance
              </span>
            </div>

            <h1>
              Test your
              <span>
                {" "}typing speed.
              </span>
            </h1>

            <p>
              Improve your speed, accuracy, and
              confidence with every test.
            </p>
          </div>
        </section>

        {/* =================================================
            DURATION
        ================================================= */}

        <section
          className="duration-card"
          aria-label="Test duration"
        >
          <div className="duration-info">
            <div className="duration-title-row">
              <span className="duration-icon">
                ⏱
              </span>

              <span className="duration-label">
                Test duration
              </span>
            </div>

            <span className="duration-description">
              Choose your challenge
            </span>
          </div>

          <div
            className="duration-selector"
            role="group"
            aria-label="Choose test duration"
          >
            {TEST_DURATIONS.map(
              (testDuration) => {
                const isActive =
                  duration === testDuration;

                return (
                  <button
                    key={testDuration}
                    type="button"
                    className={`duration-button ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() =>
                      handleDurationChange(
                        testDuration
                      )
                    }
                    disabled={isStarted}
                    aria-pressed={isActive}
                  >
                    <span>
                      {testDuration}
                    </span>

                    <small>
                      sec
                    </small>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section
          className="stats-section"
          aria-label="Typing statistics"
        >
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

        {/* =================================================
            ACTIVE TEST
        ================================================= */}

        {!isFinished ? (
          <section
            className="typing-section"
            aria-label="Typing test"
          >
            <div className="typing-card">

              {/* =================================================
                  CARD HEADER
              ================================================= */}

              <div className="typing-card-header">

                <div className="typing-heading">

                  <div className="typing-label-row">

                    <span className="typing-label">
                      Typing Test
                    </span>

                    <div
                      className={`live-indicator ${
                        isStarted
                          ? "live"
                          : "ready"
                      }`}
                      aria-live="polite"
                    >
                      <span />

                      {isStarted
                        ? "Live"
                        : "Ready"}
                    </div>

                  </div>

                  <h2>
                    Type the text below
                  </h2>

                  <p>
                    Focus on accuracy and let
                    your speed improve naturally.
                  </p>

                </div>

                {/* =================================================
                    TIMER
                ================================================= */}

                <Timer
                  timeLeft={timeLeft}
                  totalTime={duration}
                  isStarted={isStarted}
                />

              </div>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div
                className="typing-card-divider"
                aria-hidden="true"
              />

              {/* =================================================
                  TYPING AREA
              ================================================= */}

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

              {/* =================================================
                  ACTION BAR
              ================================================= */}

              <div className="test-actions">

                <div
                  className={`typing-status ${
                    isStarted ? "active" : ""
                  }`}
                >
                  <span className="keyboard-icon">
                    ⌨
                  </span>

                  <div className="typing-status-content">
                    <strong>
                      {isStarted
                        ? "Keep typing"
                        : "Ready when you are"}
                    </strong>

                    <span>
                      {isStarted
                        ? "Stay focused on the text"
                        : "Start typing to begin the test"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="restart-button"
                  onClick={handleRestart}
                >
                  <span
                    className="restart-icon"
                    aria-hidden="true"
                  >
                    ↻
                  </span>

                  <span>
                    Restart
                  </span>
                </button>

              </div>

            </div>
          </section>
        ) : (

          /* =================================================
             RESULT
          ================================================= */

          <section
            className="result-section"
            aria-label="Typing test result"
          >
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

            {/* =================================================
                SAVE STATUS
            ================================================= */}

            <div
              className={`result-save-status ${
                isSavingResult
                  ? "saving"
                  : saveError
                  ? "error"
                  : "success"
              }`}
              role="status"
              aria-live="polite"
            >
              {isSavingResult && (
                <>
                  <span className="status-spinner" />

                  <span>
                    Saving your result...
                  </span>
                </>
              )}

              {!isSavingResult &&
                !saveError && (
                  <>
                    <span className="status-icon">
                      ✓
                    </span>

                    <span>
                      Result saved successfully
                    </span>
                  </>
                )}

              {!isSavingResult &&
                saveError && (
                  <>
                    <span className="status-icon">
                      !
                    </span>

                    <span>
                      {saveError}
                    </span>
                  </>
                )}
            </div>
          </section>
        )}

        {/* =================================================
            FOOTER TIP
        ================================================= */}

        <div className="keyboard-hint">
          <span>
            Tip
          </span>

          <p>
            Stay relaxed and focus on accuracy
            before speed.
          </p>
        </div>

      </main>
    </div>
  );
}