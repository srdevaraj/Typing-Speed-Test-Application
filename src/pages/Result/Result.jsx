import { useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result() {
  const navigate = useNavigate();

  return (
    <main className="result-page">
      <div className="result-page-content">
        <h1>Results</h1>

        <p>
          Your typing test results will appear here.
        </p>

        <button onClick={() => navigate("/")}>
          Start New Test
        </button>
      </div>
    </main>
  );
}