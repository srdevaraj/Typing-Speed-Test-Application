const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const saveResult = async (result) => {
  const response = await fetch(`${API_BASE_URL}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(result)
  });

  if (!response.ok) {
    throw new Error("Failed to save typing test result");
  }

  return response.json();
};