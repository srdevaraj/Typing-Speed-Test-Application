import apiClient from "./apiClient";

/**
 * Save completed typing test.
 *
 * POST /api/results
 */
export const saveResult = async (resultData) => {
  console.log(
    "========== SAVE RESULT =========="
  );

  console.log(
    "Result data:",
    resultData
  );

  const response = await apiClient.post(
    "/results",
    {
      wpm: resultData.wpm,
      accuracy: resultData.accuracy,
      correctCharacters:
        resultData.correctCharacters,
      incorrectCharacters:
        resultData.incorrectCharacters,
      duration: resultData.duration,
      passage: resultData.passage,
    }
  );

  console.log(
    "Result saved:",
    response.data
  );

  console.log(
    "================================="
  );

  return response.data;
};

/**
 * Get logged-in user's results.
 *
 * GET /api/results
 */
export const getMyResults = async () => {
  const response = await apiClient.get(
    "/results"
  );

  return response.data;
};