// pages/admin/AdminVaccinations.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { getAdminVaccinations, deleteVaccinationAdmin } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Syringe, 
  Search, 
  Eye, 
  Trash2, 
  Calendar, 
  User, 
  Dog, 
  Stethoscope,
  X,
  ChevronLeft,
  ChevronRight,
  Activity
} from "lucide-react";

function AdminVaccinations() {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchVaccinations();
  }, [page, search]);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const response = await getAdminVaccinations(page, search);
      setVaccinations(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data vaksinasi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, vaccine_name, pet_name) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      html: `Apakah Anda yakin ingin menghapus vaksinasi <strong>${vaccine_name}</strong> untuk <strong>${pet_name}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#7A9D82",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteVaccinationAdmin(id);
      toast.success("Vaksinasi berhasil dihapus");
      fetchVaccinations();
    } catch (error) {
      toast.error("Gagal menghapus vaksinasi");
    }
  };

  const handleViewDetail = (vaccination) => {
    setSelectedVaccination(vaccination);
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
              <Syringe className="w-6 h-6 text-[#7A9D82]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2F3E36]">Vaksinasi</h1>
              <p className="text-sm text-[#2F3E36]/60">Kelola seluruh riwayat vaksinasi pengguna</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2F3E36]/50 text-sm">Total Vaksinasi</p>
                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
              </div>
              <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                <Syringe className="w-5 h-5 text-[#7A9D82]" />
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

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama vaksin atau nama pet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        

        {/* Vaccinations Grid */}
        {loading ? (
          <Loading />
        ) : vaccinations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vaccinations.map(vaccination => (
                <div 
                  key={vaccination.id} 
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <div className="h-1 bg-linear-to-r from-[#E2A76F] to-[#F0C49A]"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-[#2F3E36]">{vaccination.vaccine_name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Dog className="w-3.5 h-3.5 text-[#7A9D82]" />
                          <p className="text-sm text-gray-500">{vaccination.pet_name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Pemilik:</span>
                        <span className="font-medium text-[#2F3E36]">{vaccination.owner_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Dokter:</span>
                        <span>{vaccination.doctor || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500">Tanggal:</span>
                        <span>{formatDate(vaccination.vaccine_date)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(vaccination)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(vaccination.id, vaccination.vaccine_name, vaccination.pet_name)}
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
              <Syringe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E36]">Tidak ada data vaksinasi</h3>
            <p className="text-gray-400 text-sm mt-1">Belum ada riwayat vaksinasi yang tersedia</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedVaccination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="bg-linear-to-r from-[#7A9D82] to-[#8AAD92] text-white rounded-t-2xl px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Syringe className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Detail Vaksinasi</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-white text-2xl hover:opacity-80 transition">×</button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Vaksin</span>
                <span className="font-medium text-[#2F3E36]">{selectedVaccination.vaccine_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pet</span>
                <span className="text-[#2F3E36]">{selectedVaccination.pet_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Pemilik</span>
                <span className="text-[#2F3E36]">{selectedVaccination.owner_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Dokter</span>
                <span className="text-[#2F3E36]">{selectedVaccination.doctor || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Tanggal Vaksinasi</span>
                <span className="text-[#2F3E36]">{formatDate(selectedVaccination.vaccine_date)}</span>
              </div>
              {selectedVaccination.next_vaccine_date && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Vaksin Berikutnya</span>
                  <span className="text-[#2F3E36]">{formatDate(selectedVaccination.next_vaccine_date)}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-gray-500 block mb-2">Catatan</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedVaccination.notes || "-"}</p>
              </div>
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
      `}</style>
    </>
  );
}

export default AdminVaccinations;
