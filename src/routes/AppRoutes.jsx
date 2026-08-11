import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Result from "../pages/Result/Result";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}