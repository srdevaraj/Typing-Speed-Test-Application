import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Result from "../pages/Result/Result";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected */}
      <Route
        element={<ProtectedRoute />}
      >
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/result"
          element={<Result />}
        />
      </Route>

      {/* Unknown */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;