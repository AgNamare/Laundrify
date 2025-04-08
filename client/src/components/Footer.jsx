import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Clock, User } from "lucide-react";

const navItems = [
  { name: "Home", path: "/app", icon: Home },
  { name: "Chat", path: "/chat", icon: MessageSquare },
  { name: "History", path: "/history", icon: Clock },
  { name: "Profile", path: "/profile", icon: User },
];

const Footer = () => {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <footer className="fixed bottom-0 left-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white z-10 text-slate-400 ">
      <nav className="flex justify-around p-3">
        {navItems.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-primary" : "text-slate-400"
              }`}
            >
              <Icon size={20} className={isActive ? "text-primary" : ""} />
              {name}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default Footer;
