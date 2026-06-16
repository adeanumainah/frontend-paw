// src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { 
  PawPrint, 
  LogOut, 
  LayoutDashboard, 
  Dog, 
  Syringe, 
  FileText, 
  Calendar, 
  User,
  Menu,
  X,
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme(); // TAMBAHKAN INI

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

  const userLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/pets", label: "Pets", icon: Dog },
    { to: "/vaccinations", label: "Vaccinations", icon: Syringe },
    { to: "/medical-records", label: "Medical Records", icon: FileText },
    { to: "/schedules", label: "Schedule", icon: Calendar },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  ];

  if (role !== "admin") {
    return (
      <>
        <nav className="sticky top-0 z-50 bg-[#7A9D82] dark:bg-[#0f2b22] shadow-lg transition-colors duration-300">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex justify-between items-center h-14 sm:h-16 gap-1 sm:gap-2">
              {/* Logo - Kiri */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1 sm:gap-2 group shrink-0"
              >
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl transition-all duration-300 group-hover:bg-white/30">
                  <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white hidden sm:inline">
                  PawCare
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
                {userLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 group relative"
                    title={link.label}
                  >
                    <link.icon className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs lg:text-sm font-medium hidden lg:inline">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Tombol Dark Mode & Logout */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Tombol Dark Mode */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                  title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-xs lg:text-sm font-medium hidden lg:inline">
                    Logout
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden flex flex-col gap-1.5 p-2"
                >
                  <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                  <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
                  <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="py-3 space-y-1 border-t border-white/20">
                {userLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Admin navbar
  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#7A9D82] dark:bg-[#0f2b22] shadow-lg transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-1 sm:gap-2">
            <Link to="/admin" className="flex items-center gap-1 sm:gap-2 group shrink-0">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl transition-all duration-300 group-hover:bg-white/30">
                <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:inline">PawCare</span>
              <span className="text-[10px] sm:text-xs bg-[#E2A76F] text-white px-1.5 sm:px-2 py-0.5 rounded-full">Admin</span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
              <Link to="/admin" className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 group">
                <LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs lg:text-sm font-medium hidden lg:inline">Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Tombol Dark Mode */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button onClick={handleLogout} className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all duration-300 group shrink-0">
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs lg:text-sm font-medium hidden lg:inline">Logout</span>
              </button>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </button>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="py-3 space-y-1 border-t border-white/20">
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10">
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 w-full">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

