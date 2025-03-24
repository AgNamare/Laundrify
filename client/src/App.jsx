import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyCodePage from "./pages/VerifyCodePage.jsx";
import LaundramatRegister from "./pages/LaundramatRegister.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify" element={<VerifyCodePage />} />
      <Route path="/register-laundramat" element={<LaundramatRegister />} />
    </Routes>
  );
}

export default AppRoutes;
