import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const user = useSelector((state) => state.user?.user?.user);
  const laundromatId = user?.laundromat;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-4 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link to="/laundromat/dashboard" className="hover:underline">Home</Link>
          </li>
          <li className="mb-2">
            <Link to={`/laundromat/${laundromatId}/services`} className="hover:underline">
              Services
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
