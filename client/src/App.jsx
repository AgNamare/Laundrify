import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyCodePage from "./pages/VerifyCodePage.jsx";
import LaundramatRegister from "./pages/LaundramatRegister.jsx";
import LaundromatHomepage from "./pages/LaundromatHomepage.jsx";
import ServiceManagementPage from "./pages/ServiceManagementPage.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import UpdateServicePage from "./pages/UpdateServicePage.jsx";
import LaundryOrderPage from "./pages/LaundryOrderPage.jsx";
import AddNewServicePage from "./pages/AddNewServicePage.jsx";
import OrderDetails from "./pages/OrderDetailsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify" element={<VerifyCodePage />} />
      <Route path="/register-laundromat" element={<LaundramatRegister />} />
      <Route path="/laundry/:id/order" element={<LaundryOrderPage />} />

      {/* Dashboard Layout */}
      <Route path="/laundromat" element={<DashboardLayout />}>
        <Route path="/laundromat/dashboard" element={<LaundromatHomepage />} />
        <Route path="/laundromat/:laundromatId/services" element={<ServiceManagementPage />} />
        <Route path="/laundromat/:laundromatId/services/add" element={<AddNewServicePage />} />
        <Route path="/laundromat/:laundromatId/services/:category" element={<UpdateServicePage />} />
        <Route path="/laundromat" element={<DashboardLayout />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
