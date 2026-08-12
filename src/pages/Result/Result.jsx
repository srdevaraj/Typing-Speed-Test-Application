import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResults } from "../../services/resultService";
import "./Result.css";

export default function Result() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyResults();

        console.log("My typing results:", response);

        if (!isMounted) return;

        if (Array.isArray(response)) {
          setResults(response);
        } else if (Array.isArray(response?.data)) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        if (!isMounted) return;

        console.error(
          "Failed to load results:",
          err?.response?.data || err
        );

        const status = err?.response?.status;
        const responseData = err?.response?.data;

        if (status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (status === 403) {
          setError(
            "You are not authorized to view your results."
          );
        } else if (status === 404) {
          setError("Results endpoint was not found.");
        } else if (responseData?.message) {
          setError(responseData.message);
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

  const statistics = useMemo(() => {
    if (!results.length) {
      return {
        bestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        totalTests: 0,
      };
    }

    const totalWpm = results.reduce(
      (sum, result) => sum + Number(result.wpm ?? 0),
      0
    );

    const totalAccuracy = results.reduce(
      (sum, result) =>
        sum + Number(result.accuracy ?? 0),
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
    };
  }, [results]);

  return (
    <main className="result-page">
      <div className="result-page-content">

        {/* Header */}
        <section className="result-hero">
          <div>
            <span className="result-eyebrow">
              PERFORMANCE
            </span>

            <h1>Your Typing Results</h1>

            <p>
              Track your typing speed, accuracy,
              and progress over time.
            </p>
          </div>

          <button
            className="new-test-button"
            type="button"
            onClick={() => navigate("/")}
          >
            <span>+</span>
            New Test
          </button>
        </section>

        {/* Loading */}
        {isLoading && (
          <section className="results-loading">
            <div className="loading-spinner"></div>

            <h3>Loading your results</h3>

            <p>
              Fetching your typing performance...
            </p>
          </section>
        )}

        {/* Error */}
        {!isLoading && error && (
          <section className="results-error">
            <div className="error-icon">!</div>

            <h2>Unable to load results</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login Again
            </button>
          </section>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          results.length === 0 && (
            <section className="empty-results">
              <div className="empty-icon">
                ⌨
              </div>

              <h2>No results yet</h2>

              <p>
                Complete your first typing test to
                start tracking your performance.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
              >
                Start Your First Test
              </button>
            </section>
          )}

        {/* Results */}
        {!isLoading &&
          !error &&
          results.length > 0 && (
            <>
              {/* Statistics */}
              <section className="stats-grid">

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">
                      BEST SPEED
                    </span>

                    <div className="stat-icon">
                      ⚡
                    </div>
                  </div>

                  <strong>
                    {statistics.bestWpm}
                  </strong>

                  <span className="stat-unit">
                    WPM
                  </span>

                  <p>Your fastest typing speed</p>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">
                      AVG. SPEED
                    </span>

                    <div className="stat-icon">
                      ◈
                    </div>
                  </div>

                  <strong>
                    {statistics.averageWpm}
                  </strong>

                  <span className="stat-unit">
                    WPM
                  </span>

                  <p>Your average typing speed</p>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">
                      ACCURACY
                    </span>

                    <div className="stat-icon">
                      ✓
                    </div>
                  </div>

                  <strong>
                    {statistics.averageAccuracy}
                  </strong>

                  <span className="stat-unit">
                    %
                  </span>

                  <p>Your average accuracy</p>
                </div>

                <div className="stat-card">
                  <div className="stat-card-top">
                    <span className="stat-label">
                      TOTAL TESTS
                    </span>

                    <div className="stat-icon">
                      ▣
                    </div>
                  </div>

                  <strong>
                    {statistics.totalTests}
                  </strong>

                  <span className="stat-unit">
                    TESTS
                  </span>

                  <p>Completed typing tests</p>
                </div>
              </section>

              {/* History */}
              <section className="history-section">

                <div className="history-header">
                  <div>
                    <span className="result-eyebrow">
                      HISTORY
                    </span>

                    <h2>Recent Tests</h2>
                  </div>

                  <span className="test-count">
                    {results.length}{" "}
                    {results.length === 1
                      ? "test"
                      : "tests"}
                  </span>
                </div>

                <div className="results-list">
                  {results.map(
                    (result, index) => (
                      <article
                        key={
                          result.id ??
                          result.resultId ??
                          index
                        }
                        className="result-item"
                        style={{
                          "--animation-delay": `${
                            index * 80
                          }ms`,
                        }}
                      >
                        <div className="result-rank">
                          #{index + 1}
                        </div>

                        <div className="result-main">
                          <div className="result-speed">
                            <strong>
                              {result.wpm ?? 0}
                            </strong>

                            <span>WPM</span>
                          </div>

                          <div className="accuracy">
                            <span>
                              Accuracy
                            </span>

                            <strong>
                              {result.accuracy ??
                                0}
                              %
                            </strong>
                          </div>

                          <div className="result-stat">
                            <span>
                              Correct
                            </span>

                            <strong>
                              {result.correctCharacters ??
                                0}
                            </strong>
                          </div>

                          <div className="result-stat error-stat">
                            <span>
                              Errors
                            </span>

                            <strong>
                              {result.incorrectCharacters ??
                                0}
                            </strong>
                          </div>

                          <div className="result-stat">
                            <span>
                              Duration
                            </span>

                            <strong>
                              {result.duration ??
                                0}
                              s
                            </strong>
                          </div>
                        </div>

                        <div
                          className="accuracy-bar"
                          style={{
                            "--accuracy":
                              `${Math.min(
                                Number(
                                  result.accuracy ??
                                    0
                                ),
                                100
                              )}%`,
                          }}
                        >
                          <span></span>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </section>

              {/* Bottom CTA */}
              <section className="results-cta">
                <div>
                  <span>
                    READY FOR ANOTHER ROUND?
                  </span>

                  <h2>
                    Improve your personal best.
                  </h2>

                  <p>
                    Keep practicing and push your
                    typing speed higher.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Start New Test
                  <span>→</span>
                </button>
              </section>
            </>
          )}
      </div>
    </main>
  );
}