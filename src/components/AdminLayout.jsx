import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { logoutUser } from "../services/authService";
import {
  LayoutDashboard,
  Users,
  Dog,
  Syringe,
  FileText,
  Calendar,
  Newspaper,
  Stethoscope,
  Utensils,
  LogOut,
  PawPrint,
  Menu,
  X,
  ChevronRight,
  Activity,
  Award,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function AdminLayout() {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Manajemen Users", icon: Users },
    { path: "/admin/pets", label: "Manajemen Pets", icon: Dog },
    { path: "/admin/vaccinations", label: "Vaksinasi", icon: Syringe },
    { path: "/admin/medical-records", label: "Medical Records", icon: FileText },
    { path: "/admin/schedules", label: "Schedule", icon: Calendar },
    { path: "/admin/articles", label: "Articles", icon: Newspaper },
    { path: "/admin/health-tips", label: "Health Tips", icon: Stethoscope },
    { path: "/admin/foods", label: "Food Recommendations", icon: Utensils },
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={`h-screen transition-colors duration-300 ${
  darkMode
    ? "bg-[#0f172a]"
    : "bg-[#F9F6F0]"
}`}>
      {/* Top Bar - Fixed */}
      <div className={`sticky top-0 z-30 shadow-md shrink-0 transition-colors duration-300 ${
  darkMode
    ? "bg-[#0f2b22]"
    : "bg-[#7A9D82]"
}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
             
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            >
              {sidebarOpen && !isMobile ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                PawCare Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
    onClick={toggleDarkMode}
    className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
  >
    {darkMode ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    )}
  </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
              <Activity className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">Admin Panel</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - flex row untuk sidebar dan konten */}
      <div className="flex h-full">
       
        <aside
  className={`
    shadow-xl
    transition-all
    duration-300
    overflow-hidden
    shrink-0
    ${
      darkMode
        ? "bg-slate-900 border-r border-slate-700"
        : "bg-white/80 border-r border-gray-100"
    }
    ${sidebarOpen ? "w-72" : "w-0 md:w-20"}
    ${isMobile && !sidebarOpen ? "hidden" : "block"}
  `}
>
          {/* Sidebar Header */}
          {sidebarOpen && !isMobile && (
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-[#7A9D82] to-[#8AAD92] p-2 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2F3E36]">Admin Panel</h3>
                  <p className="text-xs text-[#2F3E36]/50">Manage your platform</p>
                </div>
              </div>
            </div>
          )}

          {/* <nav className="p-4 space-y-1.5"> */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-linear-to-r from-[#7A9D82] to-[#8AAD92] text-white shadow-md"
                    : "text-[#2F3E36] hover:bg-[#7A9D82]/10"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-[#7A9D82] group-hover:text-[#7A9D82]"
                  }`}
                />
                {(sidebarOpen || (!sidebarOpen && !isMobile)) && (
                  <span className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#2F3E36] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none shadow-lg">
                    {item.label}
                  </div>
                )}
                {isActive(item.path) &&
                  (sidebarOpen || (!sidebarOpen && !isMobile)) && (
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && !isMobile && (
            <div className="
  p-4
  border-t
  border-gray-100
  bg-white/80
  backdrop-blur-md
">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7A9D82]/20 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-[#7A9D82]" />
                </div>
                <div>
                  <p className="text-xs text-[#2F3E36]/60">PawCare adeaanaa</p>
                  <p className="text-xs text-[#2F3E36]/40">
                    © 2026 All rights reserved
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content - Scrollable area */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${
    darkMode
      ? "bg-[#0f172a]"
      : "bg-[#F9F6F0]"
  }`}>
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay untuk mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;
