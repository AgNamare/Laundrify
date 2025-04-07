import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col bg-gray-100 px-2 py-5">
      <main className="flex-1 pb-16 p-4 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
