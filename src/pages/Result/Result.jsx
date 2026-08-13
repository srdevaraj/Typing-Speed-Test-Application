import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";

import {
  getMyResults,
} from "../../services/resultService";

import "./Result.css";


export default function Result() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  /*
   * =========================================================
   * LOAD RESULTS
   * =========================================================
   */

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyResults();

        if (!isMounted) {
          return;
        }

        if (Array.isArray(response)) {
          setResults(response);
        } else if (
          Array.isArray(response?.data)
        ) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const status =
          err?.response?.status;

        const responseData =
          err?.response?.data;

        if (status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (status === 403) {
          setError(
            "You are not authorized to view your results."
          );
        } else if (status === 404) {
          setError(
            "Results endpoint was not found."
          );
        } else if (
          responseData?.message
        ) {
          setError(
            responseData.message
          );
        } else if (err?.request) {
          setError(
            "Unable to connect to the server."
          );
        } else {
          setError(
            "Unable to load your typing results."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      isMounted = false;
    };
  }, []);


  /*
   * =========================================================
   * STATISTICS
   * =========================================================
   */

  const statistics = useMemo(() => {
    if (!results.length) {
      return {
        bestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        totalTests: 0,
        totalCorrect: 0,
        totalErrors: 0,
      };
    }

    const totalWpm =
      results.reduce(
        (sum, result) =>
          sum +
          Number(result.wpm ?? 0),
        0
      );

    const totalAccuracy =
      results.reduce(
        (sum, result) =>
          sum +
          Number(result.accuracy ?? 0),
        0
      );

    const totalCorrect =
      results.reduce(
        (sum, result) =>
          sum +
          Number(
            result.correctCharacters ?? 0
          ),
        0
      );

    const totalErrors =
      results.reduce(
        (sum, result) =>
          sum +
          Number(
            result.incorrectCharacters ?? 0
          ),
        0
      );

    const bestWpm = Math.max(
      ...results.map((result) =>
        Number(result.wpm ?? 0)
      )
    );

    return {
      bestWpm,
      averageWpm: Math.round(
        totalWpm / results.length
      ),
      averageAccuracy: Math.round(
        totalAccuracy / results.length
      ),
      totalTests: results.length,
      totalCorrect,
      totalErrors,
    };
  }, [results]);


  /*
   * =========================================================
   * BEST RESULT
   * =========================================================
   */

  const bestResult = useMemo(() => {
    if (!results.length) {
      return null;
    }

    return results.reduce(
      (best, current) => {
        const currentWpm =
          Number(current.wpm ?? 0);

        const bestWpm =
          Number(best?.wpm ?? 0);

        return currentWpm > bestWpm
          ? current
          : best;
      },
      results[0]
    );
  }, [results]);


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="result-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="result-background"
        aria-hidden="true"
      >
        <div className="result-glow result-glow-one" />

        <div className="result-glow result-glow-two" />

        <div className="result-grid" />
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="result-container">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="result-hero">

          <div className="result-hero-content">

            <div className="result-badge">
              <span className="result-badge-dot" />

              Performance Dashboard
            </div>

            <h1>
              Your typing
              <span>
                {" "}performance.
              </span>
            </h1>

            <p>
              Track your speed, accuracy, and
              progress from every typing session.
            </p>

          </div>


          <button
            type="button"
            className="new-test-button"
            onClick={() => navigate("/")}
          >
            <span className="button-plus">
              +
            </span>

            New Test

            <span className="button-arrow">
              →
            </span>
          </button>

        </section>


        {/* ===================================================
            LOADING
        =================================================== */}

        {isLoading && (
          <ResultLoading />
        )}


        {/* ===================================================
            ERROR
        =================================================== */}

        {!isLoading && error && (
          <ResultError
            error={error}
            onLogin={() =>
              navigate("/login")
            }
          />
        )}


        {/* ===================================================
            EMPTY
        =================================================== */}

        {!isLoading &&
          !error &&
          results.length === 0 && (
            <EmptyResults
              onStart={() =>
                navigate("/")
              }
            />
          )}


        {/* ===================================================
            DATA
        =================================================== */}

        {!isLoading &&
          !error &&
          results.length > 0 && (
            <>
              <section className="overview-section">

                <div className="section-heading">

                  <div>
                    <span className="section-eyebrow">
                      OVERVIEW
                    </span>

                    <h2>
                      Performance snapshot
                    </h2>
                  </div>

                  <div className="overview-status">
                    <span className="status-dot" />

                    {statistics.totalTests}{" "}
                    completed{" "}
                    {statistics.totalTests === 1
                      ? "test"
                      : "tests"}
                  </div>

                </div>


                {/* =========================================
                    STAT CARDS
                ========================================= */}

                <div className="stats-grid">

                  <StatCard
                    label="BEST SPEED"
                    value={
                      statistics.bestWpm
                    }
                    unit="WPM"
                    description="Your fastest typing speed"
                    icon="↗"
                    variant="speed"
                    delay="0ms"
                  />

                  <StatCard
                    label="AVERAGE SPEED"
                    value={
                      statistics.averageWpm
                    }
                    unit="WPM"
                    description="Average performance"
                    icon="◈"
                    variant="average"
                    delay="70ms"
                  />

                  <StatCard
                    label="ACCURACY"
                    value={
                      statistics.averageAccuracy
                    }
                    unit="%"
                    description="Average typing accuracy"
                    icon="✓"
                    variant="accuracy"
                    delay="140ms"
                  />

                  <StatCard
                    label="TOTAL TESTS"
                    value={
                      statistics.totalTests
                    }
                    unit="TESTS"
                    description="Completed typing sessions"
                    icon="▣"
                    variant="tests"
                    delay="210ms"
                  />

                </div>


                {/* =========================================
                    SECONDARY INSIGHTS
                ========================================= */}

                <div className="insight-grid">

                  <div className="insight-card">

                    <div className="insight-icon">
                      ✓
                    </div>

                    <div className="insight-content">

                      <span>
                        TOTAL CORRECT
                      </span>

                      <strong>
                        {statistics.totalCorrect.toLocaleString()}
                      </strong>

                      <p>
                        Characters typed correctly
                      </p>

                    </div>

                  </div>


                  <div className="insight-card">

                    <div className="insight-icon error">
                      !
                    </div>

                    <div className="insight-content">

                      <span>
                        TOTAL ERRORS
                      </span>

                      <strong>
                        {statistics.totalErrors.toLocaleString()}
                      </strong>

                      <p>
                        Characters requiring improvement
                      </p>

                    </div>

                  </div>


                  <div className="insight-card best-insight">

                    <div className="insight-icon trophy">
                      ★
                    </div>

                    <div className="insight-content">

                      <span>
                        PERSONAL BEST
                      </span>

                      <strong>
                        {bestResult?.wpm ?? 0}
                        <small>
                          WPM
                        </small>
                      </strong>

                      <p>
                        Your highest recorded speed
                      </p>

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================================
                  HISTORY
              ================================================= */}

              <section className="history-section">

                <div className="history-header">

                  <div>

                    <span className="section-eyebrow">
                      HISTORY
                    </span>

                    <h2>
                      Recent typing tests
                    </h2>

                    <p>
                      Review your performance from
                      every completed session.
                    </p>

                  </div>

                  <span className="history-count">
                    {results.length}

                    <small>
                      {results.length === 1
                        ? " test"
                        : " tests"}
                    </small>
                  </span>

                </div>


                <div className="results-list">

                  {results.map(
                    (result, index) => {
                      const accuracy = Math.min(
                        Number(
                          result.accuracy ?? 0
                        ),
                        100
                      );

                      const isBest =
                        Number(
                          result.wpm ?? 0
                        ) ===
                        statistics.bestWpm;

                      return (
                        <article
                          key={
                            result.id ??
                            result.resultId ??
                            index
                          }
                          className={`result-item ${
                            isBest
                              ? "best-result"
                              : ""
                          }`}
                          style={{
                            "--animation-delay": `${
                              index * 70
                            }ms`,
                          }}
                        >

                          <div className="result-item-left">

                            <div className="result-rank">

                              {isBest ? (
                                <span className="rank-trophy">
                                  ★
                                </span>
                              ) : (
                                `#${index + 1}`
                              )}

                            </div>

                            <div className="result-primary">

                              <div className="result-speed">

                                <strong>
                                  {result.wpm ?? 0}
                                </strong>

                                <span>
                                  WPM
                                </span>

                              </div>

                              {isBest && (
                                <span className="best-badge">
                                  PERSONAL BEST
                                </span>
                              )}

                            </div>

                          </div>


                          <div className="result-metrics">

                            <Metric
                              label="Accuracy"
                              value={`${result.accuracy ?? 0}%`}
                              variant="accuracy"
                            />

                            <Metric
                              label="Correct"
                              value={
                                result.correctCharacters ??
                                0
                              }
                            />

                            <Metric
                              label="Errors"
                              value={
                                result.incorrectCharacters ??
                                0
                              }
                              variant="error"
                            />

                            <Metric
                              label="Duration"
                              value={`${result.duration ?? 0}s`}
                            />

                          </div>


                          <div className="result-accuracy">

                            <div className="accuracy-header">

                              <span>
                                Accuracy
                              </span>

                              <strong>
                                {accuracy}%
                              </strong>

                            </div>

                            <div className="accuracy-track">

                              <span
                                style={{
                                  "--accuracy": `${accuracy}%`,
                                }}
                              />

                            </div>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>

              </section>


              {/* =================================================
                  CTA
              ================================================= */}

              <section className="results-cta">

                <div className="cta-decoration">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="cta-content">

                  <span className="cta-eyebrow">
                    KEEP IMPROVING
                  </span>

                  <h2>
                    Ready to beat your
                    personal best?
                  </h2>

                  <p>
                    Keep practicing, stay accurate,
                    and push your typing speed higher.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Start New Test

                  <span>
                    →
                  </span>
                </button>

              </section>

            </>
          )}

      </main>

    </div>
  );
}


/*
 * =============================================================
 * STAT CARD
 * =============================================================
 */

function StatCard({
  label,
  value,
  unit,
  description,
  icon,
  variant,
  delay,
}) {
  return (
    <article
      className={`stat-card stat-${variant}`}
      style={{
        "--animation-delay": delay,
      }}
    >

      <div className="stat-card-top">

        <span className="stat-label">
          {label}
        </span>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <div className="stat-value">

        <strong>
          {value}
        </strong>

        <span>
          {unit}
        </span>

      </div>

      <p>
        {description}
      </p>

      <div className="stat-card-glow" />

    </article>
  );
}


/*
 * =============================================================
 * METRIC
 * =============================================================
 */

function Metric({
  label,
  value,
  variant = "",
}) {
  return (
    <div
      className={`metric ${variant}`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}


/*
 * =============================================================
 * LOADING
 * =============================================================
 */

function ResultLoading() {
  return (
    <section className="loading-state">

      <div className="loading-heading">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
      </div>

      <div className="loading-stats">

        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              className="loading-card"
              key={index}
            >
              <div className="skeleton skeleton-small" />
              <div className="skeleton skeleton-number" />
              <div className="skeleton skeleton-line" />
            </div>
          )
        )}

      </div>

      <div className="loading-history">

        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              className="loading-row"
              key={index}
            >
              <div className="skeleton skeleton-avatar" />

              <div className="loading-row-content">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-small" />
              </div>
            </div>
          )
        )}

      </div>

    </section>
  );
}


/*
 * =============================================================
 * ERROR
 * =============================================================
 */

function ResultError({
  error,
  onLogin,
}) {
  return (
    <section className="state-card error-state">

      <div className="state-icon error-icon">
        !
      </div>

      <span className="state-label">
        SOMETHING WENT WRONG
      </span>

      <h2>
        Unable to load your results
      </h2>

      <p>
        {error}
      </p>

      <button
        type="button"
        onClick={onLogin}
      >
        Login Again

        <span>
          →
        </span>
      </button>

    </section>
  );
}


/*
 * =============================================================
 * EMPTY
 * =============================================================
 */

function EmptyResults({
  onStart,
}) {
  return (
    <section className="state-card empty-state">

      <div className="state-icon empty-icon">
        ⌨
      </div>

      <span className="state-label">
        YOUR JOURNEY STARTS HERE
      </span>

      <h2>
        No typing results yet
      </h2>

      <p>
        Complete your first typing test and
        start building your performance history.
      </p>

      <button
        type="button"
        onClick={onStart}
      >
        Start Your First Test

        <span>
          →
        </span>
      </button>

    </section>
  );
}