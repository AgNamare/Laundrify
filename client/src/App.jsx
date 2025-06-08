import { Route, Routes } from "react-router-dom";
import { LoadScriptNext } from "@react-google-maps/api";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyCodePage from "./pages/VerifyCodePage.jsx";
import LaundromatHomepage from "./pages/LaundromatHomepage.jsx";
import ServiceManagementPage from "./pages/ServiceManagementPage.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import UpdateServicePage from "./pages/UpdateServicePage.jsx";
import AddNewServicePage from "./pages/AddNewServicePage.jsx";
import OrderDetails from "./pages/OrderDetailsPage.jsx";
import OrderStatusTimeline from "./components/OrderStatusTimeline.jsx";
import Homepage from "./pages/Homepage.jsx";
import Layout from "./layouts/Layout.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import History from "./pages/HistoryPage.jsx";
import LaundromatRegister from "./pages/LaundramatRegister.jsx";
import LaundryOrderPage from "./pages/LaundryOrderPage.jsx";
import OrderManagementPage from "./pages/OrderManagementPage.jsx";
import UpdateOrderPage from "./pages/UpdateOrderPage.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import ChatListPage from "./pages/ChatListPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { useState } from "react";

const libraries = ["places"];

function AppRoutes() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyBSvhLpT9Mw-_39lx-7houaYb-8nzyfcQA"
      libraries={libraries}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => console.error("Google Maps failed to load", e)}
    >
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-laundromat" element={<LaundromatRegister />} />
        <Route path="/verify" element={<VerifyCodePage />} />

        {/* 🚫 Commented out because LaundromatRegister is not defined */}
        {/* <Route path="/register-laundromat" element={<LaundromatRegister />} /> */}

        <Route path="/app" element={<Layout />}>
          <Route index element={<LaundromatHomepage />} />
          <Route path="/app/checkout" element={<CheckoutPage />} />
          <Route
            path="/app/laundry/:laundromatId/"
            element={<LaundryOrderPage />}
          />
          <Route path="/app/history" element={<History />}></Route>
          <Route path="/app/chat" element={<ChatListPage />}></Route>
          <Route path="/app/chat/:chatId" element={<ChatPage />}></Route>
          <Route path="/app/order/:orderId/" element={<OrderDetails />} />
          <Route path="/app/order/track/:orderId" element={<TrackOrder />} />
        </Route>

        {/* Dashboard Layout */}
        <Route path="/laundromat" element={<DashboardLayout />}>
          <Route path="/laundromat/dashboard" element={<Homepage />} />
          <Route
            path="/laundromat/:laundromatId/services"
            element={<ServiceManagementPage />}
          />
          <Route
            path="/laundromat/:laundromatId/services/add"
            element={<AddNewServicePage />}
          />
          <Route
            path="/laundromat/:laundromatId/orders"
            element={<OrderManagementPage />}
          />
          <Route
            path="/laundromat/chat/:laundromatId"
            element={<ChatPage />}
          ></Route>
          <Route path="/laundromat/chats" element={<ChatListPage />} />
          <Route
            path="/laundromat/:laundromatId/orders/:orderId"
            element={<UpdateOrderPage />}
          />
          <Route
            path="/laundromat/:laundromatId/services/:category"
            element={<UpdateServicePage />}
          />
          <Route path="/laundromat" element={<DashboardLayout />} />
        </Route>
      </Routes>
    </LoadScriptNext>
  );
}

export default AppRoutes;
