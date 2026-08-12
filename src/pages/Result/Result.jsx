import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyResults } from "../../services/resultService";

import "./Result.css";

export default function Result() {
  const navigate = useNavigate();

  const [results, setResults] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getMyResults();

        console.log(
          "My typing results:",
          response
        );

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

        console.error(
          "Failed to load results:",
          err?.response?.data || err
        );

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

  return (
    <main className="result-page">
      <div className="result-page-content">
        <h1>Results</h1>

        {isLoading && (
          <p>
            Loading your results...
          </p>
        )}

        {!isLoading && error && (
          <>
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Login Again
            </button>
          </>
        )}

        {!isLoading &&
          !error &&
          results.length === 0 && (
            <p>
              No typing results found yet.
            </p>
          )}

        {!isLoading &&
          !error &&
          results.length > 0 && (
            <div className="results-list">
              {results.map(
                (result, index) => (
                  <div
                    key={
                      result.id ??
                      result.resultId ??
                      index
                    }
                    className="result-item"
                  >
                    <strong>
                      {result.wpm ?? 0} WPM
                    </strong>

                    <span>
                      Accuracy:{" "}
                      {result.accuracy ?? 0}%
                    </span>

                    <span>
                      Correct:{" "}
                      {result.correctCharacters ??
                        0}
                    </span>

                    <span>
                      Errors:{" "}
                      {result.incorrectCharacters ??
                        0}
                    </span>

                    <span>
                      Time:{" "}
                      {result.duration ?? 0}s
                    </span>
                  </div>
                )
              )}
            </div>
          )}

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Start New Test
        </button>
      </div>
    </main>
  );
}