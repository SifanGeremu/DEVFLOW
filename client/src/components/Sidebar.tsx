import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, User, Zap, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Zap size={18} className="text-accent-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">DevFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={isActive ? "nav-item-active" : "nav-item"}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link to="/" className="nav-item text-muted-foreground hover:text-destructive">
          <LogOut size={20} />
          <span>Sign out</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
