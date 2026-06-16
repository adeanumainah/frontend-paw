// pages/admin/AdminSchedules.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { getAdminSchedules, deleteScheduleAdmin } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Eye, 
  Trash2, 
  User, 
  Dog, 
  Clock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Activity
} from "lucide-react";

function AdminSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [page, search, statusFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await getAdminSchedules(page, search, statusFilter);
      setSchedules(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title, pet_name) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      html: `Apakah Anda yakin ingin menghapus jadwal <strong>${title}</strong> untuk <strong>${pet_name}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#7A9D82",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteScheduleAdmin(id);
      toast.success("Schedule berhasil dihapus");
      fetchSchedules();
    } catch (error) {
      toast.error("Gagal menghapus schedule");
    }
  };

  const handleViewDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Menunggu" },
      Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Selesai" },
      Cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Dibatalkan" },
      Overdue: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", label: "Terlewat" },
    };
    const style = styles[status] || styles.Pending;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
        {style.label}
      </span>
    );
  };

  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const current = page;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="p-6 pb-32">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#7A9D82]/10 p-2.5 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-[#7A9D82]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2F3E36]">Schedule Management</h1>
              <p className="text-sm text-[#2F3E36]/60">Kelola seluruh jadwal pengguna</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2F3E36]/50 text-sm">Total Jadwal</p>
                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
              </div>
              <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-[#7A9D82]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2F3E36]/50 text-sm">Halaman Saat Ini</p>
                <p className="text-2xl font-bold text-[#2F3E36]">{page}</p>
              </div>
              <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-[#7A9D82]" />
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
                placeholder="Cari berdasarkan judul atau nama pet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onClick={() => { setSearch(""); setStatusFilter("all"); setPage(1); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        

        {/* Schedules Grid */}
        {loading ? (
          <Loading />
        ) : schedules.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schedules.map(schedule => (
                <div 
                  key={schedule.id} 
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <div className="h-1 bg-linear-to-r from-[#E2A76F] to-[#F0C49A]"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#2F3E36] line-clamp-1">{schedule.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Dog className="w-3.5 h-3.5 text-[#7A9D82]" />
                          <p className="text-sm text-gray-500">{schedule.pet_name}</p>
                        </div>
                      </div>
                      {getStatusBadge(schedule.status)}
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Pemilik:</span>
                        <span className="font-medium text-[#2F3E36]">{schedule.owner_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Tanggal:</span>
                        <span className="text-[#2F3E36]">{formatDate(schedule.schedule_date)}</span>
                      </div>
                    </div>

                    {schedule.description && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{schedule.description}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(schedule)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id, schedule.title, schedule.pet_name)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                  
                  {getPageNumbers().map((p, idx) => (
                    p === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
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
                    )
                  ))}
                  
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
                  Menampilkan {((page - 1) * (pagination.limit || 10)) + 1} - {Math.min(page * (pagination.limit || 10), pagination.total || 0)} dari {pagination.total || 0} data
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E36]">Tidak ada data schedule</h3>
            <p className="text-gray-400 text-sm mt-1">Belum ada jadwal yang tersedia</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="bg-linear-to-r from-[#E2A76F] to-[#F0C49A] text-white rounded-t-2xl px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Detail Schedule</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-white text-2xl hover:opacity-80 transition">×</button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Judul</span>
                <span className="font-medium text-[#2F3E36]">{selectedSchedule.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pet</span>
                <span className="text-[#2F3E36]">{selectedSchedule.pet_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pemilik</span>
                <span className="text-[#2F3E36]">{selectedSchedule.owner_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Tanggal</span>
                <span className="text-[#2F3E36]">{formatDate(selectedSchedule.schedule_date)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span>{getStatusBadge(selectedSchedule.status)}</span>
              </div>
              {selectedSchedule.description && (
                <div className="pt-2">
                  <span className="text-gray-500 block mb-2">Deskripsi</span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedSchedule.description}</p>
                </div>
              )}
            </div>
            <div className="p-6 pt-0">
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="w-full py-2.5 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default AdminSchedules;
