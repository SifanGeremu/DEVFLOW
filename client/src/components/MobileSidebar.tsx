import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, User, Zap, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: User, label: "Profile", path: "/profile" },
];

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Zap size={14} className="text-accent-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">DevFlow</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-14 left-0 right-0 z-50 transform border-b border-border bg-background transition-all duration-300 lg:hidden ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={isActive ? "nav-item-active" : "nav-item"}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="border-t border-border my-2" />
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="nav-item text-muted-foreground hover:text-destructive"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
