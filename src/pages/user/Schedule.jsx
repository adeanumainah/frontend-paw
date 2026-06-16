import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { getPets } from "../../services/petService";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getUpcomingSchedules,
} from "../../services/scheduleService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  Calendar,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Dog,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter,
  Bell,
  ListChecks,
  FileText,
} from "lucide-react";

function Schedules() {
  const { darkMode } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [pets, setPets] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [formData, setFormData] = useState({
    pet_id: "",
    title: "",
    description: "",
    schedule_date: "",
    status: "Pending",
    reminder_days: 1,
  });

  useEffect(() => {
    fetchSchedules();
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchPets();
    fetchUpcoming();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await getSchedules(page, search, statusFilter);
      setSchedules(response.data);
      setPagination(response.pagination || { totalPages: 1, total: 0 });
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data schedule");
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await getPets(1, "", "");
      setPets(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data pets");
    }
  };

  const fetchUpcoming = async () => {
    try {
      const response = await getUpcomingSchedules(10);
      setUpcoming(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      pet_id: "",
      title: "",
      description: "",
      schedule_date: "",
      status: "Pending",
      reminder_days: 1,
    });
    setShowFormModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pet_id || !formData.title || !formData.schedule_date) {
      toast.warning("Pet, title, dan tanggal wajib diisi!");
      return;
    }

    try {
      const submitData = {
        ...formData,
        schedule_date: formData.schedule_date,
      };

      if (editingId) {
        await updateSchedule(editingId, submitData);
        toast.success("Schedule berhasil diupdate!");
      } else {
        await createSchedule(submitData);
        toast.success("Schedule berhasil ditambahkan!");
      }
      resetForm();
      fetchSchedules();
      fetchUpcoming();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    const scheduleDate = schedule.schedule_date
      ? schedule.schedule_date.split("T")[0]
      : "";
    setFormData({
      pet_id: schedule.pet_id,
      title: schedule.title || "",
      description: schedule.description || "",
      schedule_date: scheduleDate,
      status: schedule.status || "Pending",
      reminder_days: schedule.reminder_days || 1,
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Hapus Schedule?",
      html: `Apakah Anda yakin ingin menghapus schedule <strong>${title}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#7A9D82",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      borderRadius: "16px",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSchedule(id);
      toast.success("Schedule berhasil dihapus!");
      fetchSchedules();
      fetchUpcoming();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus schedule");
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateSchedule(id, { status: "Completed" });
      toast.success("Schedule ditandai selesai!");
      fetchSchedules();
      fetchUpcoming();
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengupdate status");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status, daysRemaining) => {
    if (
      status === "Pending" &&
      daysRemaining !== undefined &&
      daysRemaining <= 3 &&
      daysRemaining >= 0
    ) {
      return {
        bg: "bg-[#E2A76F]/20",
        text: "text-[#2F3E36]",
        icon: <Clock className="w-3 h-3" />,
        label: daysRemaining === 0 ? "Hari ini" : `${daysRemaining} hari lagi`,
      };
    }

    const styles = {
      Pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        icon: <Clock className="w-3 h-3" />,
        label: "Menunggu",
      },
      Completed: {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Selesai",
      },
      Cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: <X className="w-3 h-3" />,
        label: "Dibatalkan",
      },
    };
    return styles[status] || styles.Pending;
  };

  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const current = page;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const displayedUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 3);
  const hasMoreUpcoming = upcoming.length > 3;

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div
        className={`min-h-screen py-8 transition-colors duration-300 ${
          darkMode
            ? "bg-linear-to-br from-slate-900 via-blue-950 to-slate-900"
            : "bg-[#F9F6F0]"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="relative mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#7A9D82]/10 p-2.5 rounded-xl">
                    <Calendar className="w-6 h-6 text-[#7A9D82]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#2F3E36]">
                      Jadwal & Pengingat
                    </h1>
                    <p className="text-sm text-[#2F3E36]/60 mt-0.5">
                      Kelola jadwal vaksinasi, kontrol, dan kegiatan hewan
                      peliharaan
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowFormModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A9D82] text-white font-medium hover:bg-[#E2A76F] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Tambah Jadwal Baru
              </button>
            </div>
          </div>

          {/* Upcoming Schedules Widget */}
          {upcoming.length > 0 && (
            <div className="mb-6 bg-linear-to-r from-[#E2A76F] to-[#F0C49A] rounded-xl shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-white" />
                    <h3 className="font-semibold text-white text-lg">
                      Pengingat Jadwal Mendatang
                    </h3>
                    <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                      {upcoming.length} jadwal
                    </span>
                  </div>
                  {hasMoreUpcoming && (
                    <button
                      onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                      className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1"
                    >
                      {showAllUpcoming ? "Sembunyikan" : "Lihat Semua"}
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                  {displayedUpcoming.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition"
                    >
                      <div className="flex-1">
                        <p className="text-white font-semibold">{s.title}</p>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          <Dog className="w-3 h-3" />
                          {s.pet_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium text-sm">
                          {formatDate(s.schedule_date)}
                        </p>
                        <p className="text-white/80 text-xs">
                          {s.daysRemaining === 0
                            ? "Hari ini!"
                            : s.daysRemaining === 1
                              ? "Besok"
                              : `${s.daysRemaining} hari lagi`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div
              className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Total Jadwal</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">
                    {pagination.total || 0}
                  </p>
                </div>
                <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                  <ListChecks className="w-5 h-5 text-[#7A9D82]" />
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Menunggu</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">
                    {schedules.filter((s) => s.status === "Pending").length}
                  </p>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-100"
              }`}
              v
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Selesai</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">
                    {schedules.filter((s) => s.status === "Completed").length}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Mendatang</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">
                    {upcoming.length}
                  </p>
                </div>
                <div className="bg-[#E2A76F]/10 p-2 rounded-xl">
                  <Bell className="w-5 h-5 text-[#E2A76F]" />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari jadwal berdasarkan judul atau pet..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white appearance-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="Pending">Menunggu</option>
                  <option value="Completed">Selesai</option>
                  <option value="Cancelled">Dibatalkan</option>
                </select>
              </div>
              {(search || statusFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Schedules Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-[#7A9D82]/20 border-t-[#7A9D82] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : schedules.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {schedules.map((schedule) => {
                  const statusStyle = getStatusBadge(
                    schedule.status,
                    schedule.daysRemaining,
                  );
                  return (
                    <div
                      key={schedule.id}
                      className={`group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 ${
                        darkMode
                          ? "bg-slate-800 border border-slate-700"
                          : "bg-white border border-gray-100"
                      }`}
                    >
                      <div
                        className={`h-1 ${
                          schedule.status === "Completed"
                            ? "bg-green-500"
                            : schedule.status === "Cancelled"
                              ? "bg-red-500"
                              : schedule.daysRemaining !== undefined &&
                                  schedule.daysRemaining <= 3 &&
                                  schedule.daysRemaining >= 0
                                ? "bg-[#E2A76F]"
                                : "bg-linear-to-r from-[#7A9D82] to-[#8AAD92]"
                        }`}
                      ></div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-[#7A9D82]" />
                              <h3 className="font-bold text-lg text-[#2F3E36]">
                                {schedule.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Dog className="w-3.5 h-3.5" />
                              <span>{schedule.pet_name}</span>
                            </div>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {statusStyle.icon}
                            <span>{statusStyle.label}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(schedule.schedule_date)}</span>
                          </div>
                          {schedule.description && (
                            <div className="flex items-start gap-2 text-gray-500 mt-2 pt-2 border-t border-gray-100">
                              <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="text-xs line-clamp-2">
                                {schedule.description}
                              </span>
                            </div>
                          )}
                          {schedule.reminder_days > 0 && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <Bell className="w-3 h-3" />
                              <span>
                                Pengingat {schedule.reminder_days} hari
                                sebelumnya
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {schedule.status === "Pending" && (
                            <button
                              onClick={() => handleComplete(schedule.id)}
                              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Selesai
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(schedule.id, schedule.title)
                            }
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 pt-4 pb-6 border-t border-gray-200">
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium transition-all disabled:opacity-40 hover:bg-gray-50 text-gray-600 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Sebelumnya
                    </button>

                    {getPageNumbers().map((p, idx) =>
                      p === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className="px-2 text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                            page === p
                              ? "bg-[#7A9D82] text-white shadow-sm"
                              : "bg-white border border-gray-200 text-[#2F3E36] hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}

                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium transition-all disabled:opacity-40 hover:bg-gray-50 text-gray-600 flex items-center gap-1"
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Menampilkan {(page - 1) * 6 + 1} -{" "}
                    {Math.min(page * 6, pagination.total || 0)} dari{" "}
                    {pagination.total || 0} data
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#2F3E36]">
                {search || statusFilter !== "all"
                  ? "Tidak ada jadwal yang sesuai"
                  : "Belum Ada Jadwal"}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {search || statusFilter !== "all"
                  ? "Coba ubah kata kunci pencarian atau filter status"
                  : "Tambahkan jadwal untuk hewan peliharaan Anda"}
              </p>
              {search || statusFilter !== "all" ? (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-all"
                >
                  Reset Filter
                </button>
              ) : (
                <button
                  onClick={() => {
                    resetForm();
                    setShowFormModal(true);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
                >
                  + Tambah Jadwal
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFormModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#2F3E36]">
                  {editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                </h2>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                  Pilih Pet <span className="text-red-500">*</span>
                </label>
                <select
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                  required
                >
                  <option value="">-- Pilih Hewan Peliharaan --</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                  Judul Jadwal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Contoh: Vaksinasi Rabies, Kontrol Bulanan, dll"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  placeholder="Catatan tambahan tentang jadwal ini..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="schedule_date"
                    value={formData.schedule_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                  >
                    <option value="Pending">Menunggu</option>
                    <option value="Completed">Selesai</option>
                    <option value="Cancelled">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2F3E36]">
                    Pengingat (hari sebelumnya)
                  </label>
                  <select
                    name="reminder_days"
                    value={formData.reminder_days}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                  >
                    <option value="0">Tidak perlu pengingat</option>
                    <option value="1">1 hari sebelumnya</option>
                    <option value="2">2 hari sebelumnya</option>
                    <option value="3">3 hari sebelumnya</option>
                    <option value="7">1 minggu sebelumnya</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all"
                >
                  {editingId ? "Update Jadwal" : "Tambah Jadwal"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 10px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default Schedules;
