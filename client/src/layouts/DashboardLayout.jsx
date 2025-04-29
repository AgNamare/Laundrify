import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Package, ShoppingBag, MessageSquare } from "lucide-react"; // <-- Import chat icon
import logo from "../assets/images/logo.png";

const DashboardLayout = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user?.user?.user);
  const laundromatId = user?.laundromat;

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-56 bg-gray-900 text-slate-400 p-4 min-h-screen fixed flex flex-col justify-between">
        <div>
          <img src={logo} alt="Laundrify Logo" className="w-40 mb-4" />

          <ul className="mt-8">
            <h3 className="text-white mb-6 font-semibold mx-2">MENU</h3>

            <li className="mb-6">
              <Link
                to="/laundromat/dashboard"
                className={`flex items-center gap-2 px-3 py-1 ${
                  location.pathname === "/laundromat/dashboard"
                    ? "text-white border-l-4 border-primary"
                    : "text-slate-400"
                }`}
              >
                <Home
                  size={20}
                  className={
                    location.pathname === "/laundromat/dashboard"
                      ? "text-primary"
                      : "text-slate-400"
                  }
                />
                Home
              </Link>
            </li>

            <li className="mb-6">
              <Link
                to={`/laundromat/${laundromatId}/services`}
                className={`flex items-center gap-2 px-3 py-1 ${
                  location.pathname === `/laundromat/${laundromatId}/services`
                    ? "text-white border-l-4 border-primary"
                    : "text-slate-400"
                }`}
              >
                <Package
                  size={20}
                  className={
                    location.pathname === `/laundromat/${laundromatId}/services`
                      ? "text-primary"
                      : "text-slate-400"
                  }
                />
                Services
              </Link>
            </li>

            <li className="mb-6">
              <Link
                to={`/laundromat/${laundromatId}/orders`}
                className={`flex items-center gap-2 px-3 py-1 ${
                  location.pathname === `/laundromat/${laundromatId}/orders`
                    ? "text-white border-l-4 border-primary"
                    : "text-slate-400"
                }`}
              >
                <ShoppingBag
                  size={20}
                  className={
                    location.pathname === `/laundromat/${laundromatId}/orders`
                      ? "text-primary"
                      : "text-slate-400"
                  }
                />
                Orders
              </Link>
            </li>

            {/* Chats */}
            <li className="mb-6">
              <Link
                to="/laundromat/chats"
                className={`flex items-center gap-2 px-3 py-1 ${
                  location.pathname === "/laundromat/chats"
                    ? "text-white border-l-4 border-primary"
                    : "text-slate-400"
                }`}
              >
                <MessageSquare
                  size={20}
                  className={
                    location.pathname === "/laundromat/chats"
                      ? "text-primary"
                      : "text-slate-400"
                  }
                />
                Chats
              </Link>
            </li>
          </ul>
        </div>

        {/* User Greeting at Bottom */}
        <div className="text-white mt-auto p-4">
          <p className="text-sm">
            <span>
              {user?.fName} {user?.lName}
            </span>
          </p>
        </div>
      </aside>

      {/* Main Content with Scroll */}
      <main className="flex-1 p-4 ml-56 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
