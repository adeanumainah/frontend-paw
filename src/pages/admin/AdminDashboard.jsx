// pages/admin/AdminDashboard.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Dog, 
  Syringe, 
  FileText, 
  Calendar, 
  Newspaper,
  TrendingUp,
  Activity,
  Stethoscope,
  Utensils
} from "lucide-react";
import { getUsers } from "../../services/adminService";
import { getAdminPets } from "../../services/adminService";
import { getAdminVaccinations } from "../../services/adminService";
import { getAdminMedicalRecords } from "../../services/adminService";
import { getAdminSchedules } from "../../services/adminService";
import { getAdminArticles } from "../../services/articleService";
import { getAdminTips } from "../../services/healthTipService";
import { getAdminFoods } from "../../services/foodService";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalVaccinations: 0,
    totalMedicalRecords: 0,
    totalSchedules: 0,
    totalArticles: 0,
    totalHealthTips: 0,
    totalFoods: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch semua data secara parallel
      const [
        usersRes,
        petsRes,
        vaccinationsRes,
        medicalRecordsRes,
        schedulesRes,
        articlesRes,
        healthTipsRes,
        foodsRes
      ] = await Promise.all([
        getUsers(),
        getAdminPets(1, "", ""),
        getAdminVaccinations(1, ""),
        getAdminMedicalRecords(1, ""),
        getAdminSchedules(1, "", "all"),
        getAdminArticles(1, "", ""),
        getAdminTips(1, "", "all"),
        getAdminFoods(1, "", "")
      ]);
      
      setStats({
        totalUsers: usersRes.pagination?.total || usersRes.data?.length || 0,
        totalPets: petsRes.pagination?.total || 0,
        totalVaccinations: vaccinationsRes.pagination?.total || 0,
        totalMedicalRecords: medicalRecordsRes.pagination?.total || 0,
        totalSchedules: schedulesRes.pagination?.total || 0,
        totalArticles: articlesRes.pagination?.total || 0,
        totalHealthTips: healthTipsRes.pagination?.total || 0,
        totalFoods: foodsRes.pagination?.total || 0
      });
      
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Statistik cards utama
  const mainStats = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Pets", value: stats.totalPets, icon: Dog, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50" },
    { label: "Total Articles", value: stats.totalArticles, icon: Newspaper, color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50" },
    { label: "Health Tips", value: stats.totalHealthTips, icon: Activity, color: "from-teal-500 to-teal-600", bgColor: "bg-teal-50" },
    { label: "Vaccinations", value: stats.totalVaccinations, icon: Syringe, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50" },
    { label: "Medical Records", value: stats.totalMedicalRecords, icon: FileText, color: "from-cyan-500 to-cyan-600", bgColor: "bg-cyan-50" },
    { label: "Schedules", value: stats.totalSchedules, icon: Calendar, color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50" },
    { label: "Food Recs", value: stats.totalFoods, icon: Utensils, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50" },
  ];

  const menuItems = [
    { path: "/admin/users", label: "Manajemen Users", icon: Users },
    { path: "/admin/pets", label: "Manajemen Pets", icon: Dog },
    { path: "/admin/vaccinations", label: "Vaksinasi", icon: Syringe },
    { path: "/admin/medical-records", label: "Medical Records", icon: FileText },
    { path: "/admin/schedules", label: "Schedule", icon: Calendar },
    { path: "/admin/articles", label: "Articles", icon: Newspaper },
    { path: "/admin/health-tips", label: "Health Tips", icon: Activity },
    { path: "/admin/foods", label: "Food Recs", icon: Utensils },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-fadeIn">
          {/* Welcome Card Skeleton */}
          <div className="relative overflow-hidden bg-linear-to-r from-[#7A9D82] to-[#8AAD92] rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-96"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-gray-100 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="animate-fadeIn">
        {/* Welcome Card */}
        <div className="relative overflow-hidden bg-linear-to-r from-[#7A9D82] to-[#8AAD92] rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Welcome Back, Admin!
              <TrendingUp className="w-5 h-5" />
            </h1>
            <p className="text-white/80">Kelola seluruh data aplikasi PawCare dari dashboard ini dengan mudah</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-white/70">
              <Activity className="w-4 h-4" />
              <span>Total Data: {stats.totalUsers + stats.totalPets + stats.totalVaccinations + stats.totalMedicalRecords + stats.totalSchedules + stats.totalArticles + stats.totalHealthTips + stats.totalFoods}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mainStats.map((stat, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#2F3E36] mt-1">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`bg-linear-to-br ${stat.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Section */}
        <h2 className="text-lg font-semibold text-[#2F3E36] mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-[#7A9D82] rounded-full"></div>
          Menu Akses Cepat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-[#7A9D82]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-linear-to-br group-hover:from-[#7A9D82] group-hover:to-[#8AAD92] transition-all duration-300">
                <item.icon className="w-6 h-6 text-[#7A9D82] group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs font-medium text-[#2F3E36] group-hover:text-[#7A9D82] transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

  
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .hover\\:-translate-y-1:hover {
          transform: translateY(-4px);
        }
        .hover\\:-translate-y-2:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;

