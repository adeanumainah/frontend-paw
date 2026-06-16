import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ArticleWidget from "../../components/ArticleWidget";
import HealthTipsWidget from "../../components/HealthTipsWidget";
import FoodRecommendationsWidget from "../../components/FoodRecommendationsWidget";
import { getPets } from "../../services/petService";
import { getVaccines } from "../../services/vaccineService";
import { getMedicalRecords } from "../../services/medicalRecordService";
import { getSchedules } from "../../services/scheduleService";
import {
  PawPrint,
  ChevronRight,
  Dog,
  Syringe,
  FileText,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    totalPets: 0,
    totalVaccinations: 0,
    totalMedicalRecords: 0,
    upcomingSchedules: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentPets, setRecentPets] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [petsRes, vaccinesRes, medicalRes, schedulesRes] =
        await Promise.all([
          getPets(1, "", ""),
          getVaccines(1, ""),
          getMedicalRecords(1, ""),
          getSchedules(1, "", "all"),
        ]);

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingCount =
        schedulesRes.data?.filter((schedule) => {
          if (!schedule.schedule_date) return false;
          const scheduleDate = new Date(schedule.schedule_date);
          return (
            scheduleDate >= today &&
            scheduleDate <= nextWeek &&
            schedule.status !== "Completed"
          );
        }).length || 0;

      setStats({
        totalPets: petsRes.pagination?.totalItems || petsRes.data?.length || 0,
        totalVaccinations:
          vaccinesRes.pagination?.total || vaccinesRes.data?.length || 0,
        totalMedicalRecords:
          medicalRes.pagination?.total || medicalRes.data?.length || 0,
        upcomingSchedules: upcomingCount,
      });

      setRecentPets((petsRes.data || []).slice(0, 3));
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Tambah Pet Baru",
      path: "/pets",
      icon: Dog,
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      title: "Catat Vaksinasi",
      path: "/vaccinations",
      icon: Syringe,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Rekam Medis",
      path: "/medical-records",
      icon: FileText,
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
    },
    {
      title: "Buat Janji",
      path: "/schedules",
      icon: Calendar,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    },
  ];

  const statCards = [
    {
      label: "Total Pets",
      value: stats.totalPets,
      icon: Dog,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Vaccinations",
      value: stats.totalVaccinations,
      icon: Syringe,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Medical Records",
      value: stats.totalMedicalRecords,
      icon: FileText,
      color: "from-rose-500 to-rose-600",
    },
    {
      label: "Upcoming Schedule",
      value: stats.upcomingSchedules,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <>
      <Navbar />
      {/* Background utama - menggunakan class yang sama dengan App.js wrapper */}
      <div
        className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-[#0f172a]" : "bg-[#F9F6F0]"}`}
      >
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="relative mb-8 bg-linear-to-r from-[#7A9D82] to-[#8AAD92] dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-white shadow-lg transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-xl">
                  <PawPrint className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user.username || "Pet Lover"}!
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    Kelola kesehatan hewan peliharaan Anda dengan mudah di satu
                    tempat
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group
    rounded-xl
    p-4
    shadow-sm
    transition-all
    duration-300

    bg-(--bg-card)]
    border
    border-(--border-app)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#2F3E36]/50 dark:text-[#94a3b8] text-xs font-medium uppercase tracking-wide">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-[#2F3E36] dark:text-white mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`bg-linear-to-br ${stat.color} p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#334155] animate-pulse"
                >
                  <div className="h-16 bg-gray-200 dark:bg-[#334155] rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.path}
                  className="group
rounded-xl
p-3
text-center
transition-all

bg-(--bg-card)]
border
border-(--border-app)]"
                >
                  <div
                    className={`${action.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-[#2F3E36] dark:text-[#e2e8f0]">
                    {action.title}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Recent Pets Section */}
          {recentPets.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#7A9D82]/10 dark:bg-[#7A9D82]/20 p-2 rounded-lg">
                    <Dog className="w-5 h-5 text-[#7A9D82]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#2F3E36] dark:text-white">
                    Hewan Peliharaan Terbaru
                  </h2>
                </div>
                <a
                  href="/pets"
                  className="text-sm text-[#7A9D82] dark:text-[#8AAD92] hover:text-[#E2A76F] dark:hover:text-[#E2A76F] transition-colors flex items-center gap-1"
                >
                  Lihat semua
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="rounded-xl
 p-4
 border
 transition-all

 bg-(--bg-card)]
 border-(--border-app)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#7A9D82]/20 to-[#8AAD92]/20 flex items-center justify-center">
                        <Dog className="w-6 h-6 text-[#7A9D82]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2F3E36] dark:text-white">
                          {pet.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-[#94a3b8]">
                          {pet.species} • {pet.breed || "Tidak ada ras"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widgets Section */}
          <div className="space-y-6">
            <ArticleWidget />
            <HealthTipsWidget />
            <FoodRecommendationsWidget />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
