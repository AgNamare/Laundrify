import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isOrderPage = pathname.startsWith("/app/order/");
  const isTrackPage = pathname.startsWith("/app/order/track");
  const isChatPage = pathname.startsWith("/app/chat");
  console.log(isChatPage)

  const containerClasses = `flex flex-col ${
    isOrderPage ? "bg-white" : "bg-[#EFF1F5]"
  } ${isTrackPage ? "" : "px-2 py-5"}`;

  return (
    <div className={containerClasses}>
      <main
        className={`flex-1 pb-16 ${isTrackPage ? "" : ""} ${
          isChatPage ? "overflow-hidden" : "overflow-y-auto p-4"
        }`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
