import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  FileText,
  BookOpen,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
  Scale,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

export function Layout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { logout } = auth;
  const user = (auth as any).user;
  const { t, lang } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV_ITEMS = [
    { path: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { path: "/situation", icon: AlertTriangle, label: t.nav.situationAssistant },
    { path: "/chat", icon: MessageSquare, label: t.nav.aiAssistant },
    { path: "/schemes", icon: BookOpen, label: t.nav.govSchemes },
    { path: "/documents", icon: FileText, label: t.nav.documents },
    { path: "/directory", icon: MapPin, label: t.nav.legalDirectory },
    { path: "/profile", icon: User, label: t.nav.profile },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const fontFamily = getLangFont(lang);

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-white border-r border-blue-100 flex flex-col shadow-xl shadow-blue-50/50">
          {/* Logo */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-blue-50">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Scale size={18} className="text-white" />
              </div>
              <div>
                <span className="text-blue-900 font-bold text-lg tracking-tight">
                  {t.common.appName}
                </span>
                <p className="text-blue-500 text-xs -mt-0.5">{t.common.tagline}</p>
              </div>
            </Link>
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                    }`}
                  />
                  <span className="text-sm font-medium">{label}</span>
                  {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-blue-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t.common.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-blue-100 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm shadow-blue-50/50">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <p className="text-slate-500 text-sm">
                {t.nav.welcomeBack}{" "}
                <span className="text-blue-700 font-semibold">{user?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Profile */}
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
