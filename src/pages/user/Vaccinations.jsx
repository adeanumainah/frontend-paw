import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getPets } from "../../services/petService";
import {
  getVaccines,
  createVaccine,
  updateVaccine,
  deleteVaccine,
} from "../../services/vaccineService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { 
  Syringe, 
  Search, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Dog,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  CheckCircle
} from "lucide-react";

function Vaccinations() {
  const [vaccines, setVaccines] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [dateError, setDateError] = useState("");

  const [formData, setFormData] = useState({
    pet_id: "",
    vaccine_name: "",
    doctor: "",
    vaccine_date: "",
    next_vaccine_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchVaccines();
  }, [page, search]);

  useEffect(() => {
    fetchPets();
  }, []);

  // Validasi tanggal menggunakan string YYYY-MM-DD
  useEffect(() => {
    if (formData.vaccine_date && formData.next_vaccine_date) {
      if (formData.next_vaccine_date <= formData.vaccine_date) {
        setDateError("Tanggal vaksin berikutnya harus setelah tanggal vaksinasi");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [formData.vaccine_date, formData.next_vaccine_date]);

  // Hitung upcoming vaksinasi
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const upcoming = vaccines.filter(vaccine => {
      if (!vaccine.next_vaccine_date) return false;
      const [year, month, day] = vaccine.next_vaccine_date.split('T')[0].split('-');
      const nextDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      nextDate.setHours(0, 0, 0, 0);
      return nextDate >= today && nextDate <= nextWeek;
    }).sort((a, b) => {
      const [yearA, monthA, dayA] = a.next_vaccine_date.split('T')[0].split('-');
      const [yearB, monthB, dayB] = b.next_vaccine_date.split('T')[0].split('-');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
      return dateA - dateB;
    });

    setUpcomingVaccines(upcoming);
  }, [vaccines]);

  const fetchPets = async () => {
    try {
      const response = await getPets(1, "", "");
      setPets(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data pets");
    }
  };

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await getVaccines(page, search);
      setVaccines(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengambil data vaksin");
    } finally {
      setLoading(false);
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
    setDateError("");
    setFormData({
      pet_id: "",
      vaccine_name: "",
      doctor: "",
      vaccine_date: "",
      next_vaccine_date: "",
      notes: "",
    });
    setShowFormModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateString.split('T')[0].split('-');
    const targetDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEdit = (vaccine) => {
    setEditingId(vaccine.id);
    setDateError("");
    const vaccineDate = vaccine.vaccine_date || "";
    const nextVaccineDate = vaccine.next_vaccine_date ? vaccine.next_vaccine_date.split('T')[0] : "";
    
    setFormData({
      pet_id: vaccine.pet_id,
      vaccine_name: vaccine.vaccine_name || "",
      doctor: vaccine.doctor || "",
      vaccine_date: vaccineDate,
      next_vaccine_date: nextVaccineDate,
      notes: vaccine.notes || "",
    });
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pet_id || !formData.vaccine_name || !formData.vaccine_date) {
      toast.warning("Pet, nama vaksin, dan tanggal vaksin wajib diisi!");
      return;
    }

    if (formData.vaccine_date && formData.next_vaccine_date) {
      if (formData.next_vaccine_date <= formData.vaccine_date) {
        toast.warning("Tanggal vaksin berikutnya harus setelah tanggal vaksinasi!");
        return;
      }
    }

    try {
      const submitData = {
        pet_id: formData.pet_id,
        vaccine_name: formData.vaccine_name,
        doctor: formData.doctor || "",
        vaccine_date: formData.vaccine_date,
        next_vaccine_date: formData.next_vaccine_date || null,
        notes: formData.notes || "",
      };
      
      if (editingId) {
        await updateVaccine(editingId, submitData);
        toast.success("Vaksin berhasil diupdate!");
      } else {
        await createVaccine(submitData);
        toast.success("Vaksin berhasil ditambahkan!");
      }

      resetForm();
      fetchVaccines();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Hapus Vaksin?",
      html: `Apakah Anda yakin ingin menghapus vaksin <strong>${name}</strong>?`,
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
      await deleteVaccine(id);
      toast.success("Data vaksin berhasil dihapus!");
      fetchVaccines();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus vaksin");
    }
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
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Background Utama diubah ke Slate/Biru Gelap saat Dark Mode */}
      <div className="min-h-screen py-8 transition-colors duration-300"
  style={{
    backgroundColor: "var(--bg-app)",
    color: "var(--text-app)",
  }}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="relative mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#7A9D82]/10 dark:bg-[#7A9D82]/20 p-2.5 rounded-xl">
                    <Syringe className="w-6 h-6 text-[#7A9D82]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#2F3E36] dark:text-slate-100">Riwayat Vaksinasi</h1>
                    <p className="text-sm text-[#2F3E36]/60 dark:text-slate-400 mt-0.5">
                      Kelola jadwal vaksinasi hewan peliharaan Anda
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { resetForm(); setShowFormModal(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A9D82] text-white font-medium hover:bg-[#E2A76F] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Tambah Vaksinasi
              </button>
            </div>
          </div>

          {/* Upcoming Vaccines Alert */}
          {upcomingVaccines.length > 0 && (
            <div className="mb-6 bg-[#E2A76F]/10 dark:bg-[#E2A76F]/20 border-l-4 border-[#E2A76F] rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#E2A76F] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2F3E36] dark:text-slate-200 mb-2 flex items-center gap-2">
                    Pengingat Vaksinasi Mendatang
                    <span className="text-xs font-normal bg-[#E2A76F]/20 dark:bg-[#E2A76F]/40 text-[#2F3E36] dark:text-slate-200 px-2 py-0.5 rounded-full">{upcomingVaccines.length} vaksin</span>
                  </h3>
                  <div className="space-y-2">
                    {upcomingVaccines.slice(0, 3).map(v => {
                      const daysLeft = getDaysRemaining(v.next_vaccine_date);
                      const isUrgent = daysLeft <= 3;
                      return (
                        <div key={v.id} className="flex justify-between items-center text-sm flex-wrap gap-2 py-1 border-b border-[#E2A76F]/20 last:border-0">
                          <div className="flex items-center gap-2">
                            <Syringe className="w-3.5 h-3.5 text-[#E2A76F]" />
                            <span className="font-medium text-gray-700 dark:text-slate-300">{v.vaccine_name}</span>
                            <span className="text-gray-500 dark:text-slate-400">untuk</span>
                            <span className="text-gray-700 dark:text-slate-300">{v.pet_name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${isUrgent ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-[#E2A76F]/20 text-[#2F3E36] dark:text-slate-200"}`}>
                            {daysLeft === 0 ? "Hari ini!" : daysLeft === 1 ? "Besok" : `${daysLeft} hari lagi`}
                          </span>
                        </div>
                      );
                    })}
                    {upcomingVaccines.length > 3 && (
                      <p className="text-xs text-[#E2A76F] mt-1">+{upcomingVaccines.length - 3} vaksin lainnya</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Cari vaksin berdasarkan nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && vaccines.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <Syringe className="w-5 h-5 text-[#7A9D82] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#2F3E36] dark:text-slate-100">{pagination.total || 0}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Total Vaksin</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <Clock className="w-5 h-5 text-[#E2A76F] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#2F3E36] dark:text-slate-100">{upcomingVaccines.length}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Vaksin Mendatang</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <Dog className="w-5 h-5 text-[#7A9D82] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#2F3E36] dark:text-slate-100">{pets.length}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Total Pet</div>
              </div>
              <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#2F3E36] dark:text-slate-100">{vaccines.filter(v => v.next_vaccine_date && getDaysRemaining(v.next_vaccine_date) < 0).length}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">Vaksin Selesai</div>
              </div>
            </div>
          )}

          {/* Vaccines Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-[#7A9D82]/20 border-t-[#7A9D82] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : vaccines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {vaccines.map((vaccine) => {
                  const daysLeft = getDaysRemaining(vaccine.next_vaccine_date);
                  const isUpcoming = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;
                  const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
                  
                  return (
                    <div key={vaccine.id} className="
group
bg-white
dark:bg-slate-800
rounded-2xl
overflow-hidden
border border-gray-100
dark:border-slate-700
shadow-sm
hover:shadow-lg
hover:-translate-y-1
transition-all duration-300
"
style={{
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--card-border)"
  }}
>
                      <div className={`h-1 ${isUpcoming ? "bg-[#E2A76F]" : "bg-linear-to-r from-[#7A9D82] to-[#8AAD92]"}`}></div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Syringe className="w-4 h-4 text-[#7A9D82]" />
                              <h3 className="font-bold text-lg text-[#2F3E36] dark:text-slate-100">{vaccine.vaccine_name}</h3>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                              <Dog className="w-3.5 h-3.5" />
                              <span>{vaccine.pet_name}</span>
                            </div>
                          </div>
                          {isUpcoming && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${isUrgent ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-[#E2A76F]/20 text-[#2F3E36] dark:text-slate-200"}`}>
                              {daysLeft === 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                            </div>
                          )}
                          {!isUpcoming && vaccine.next_vaccine_date && (
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                              Selesai
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          {vaccine.doctor && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                              <User className="w-3.5 h-3.5" />
                              <span>Dokter: {vaccine.doctor}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Tanggal: {formatDate(vaccine.vaccine_date)}</span>
                          </div>
                          {vaccine.next_vaccine_date && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Berikutnya: {formatDate(vaccine.next_vaccine_date)}</span>
                            </div>
                          )}
                          {vaccine.notes && (
                            <div className="flex items-start gap-2 text-gray-500 dark:text-slate-400 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                              <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="text-xs">{vaccine.notes}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(vaccine)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vaccine.id, vaccine.vaccine_name)}
                            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
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
                <div className="mt-8 pt-4 pb-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium transition-all disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Sebelumnya
                    </button>
                    
                    {getPageNumbers().map((p, idx) => (
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 text-gray-400 dark:text-slate-500">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                            page === p
                              ? "bg-[#7A9D82] text-white shadow-sm"
                              : "bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 text-[#2F3E36] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                    
                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium transition-all disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center gap-1"
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-3">
                    Menampilkan {(page - 1) * 6 + 1} - {Math.min(page * 6, pagination.total || 0)} dari {pagination.total || 0} data
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="bg-gray-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Syringe className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#2F3E36] dark:text-slate-200">Belum Ada Data Vaksin</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Tambahkan riwayat vaksinasi hewan peliharaan Anda</p>
              <button
                onClick={() => { resetForm(); setShowFormModal(true); }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
              >
                + Tambah Vaksinasi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-[#1e293b] px-6 py-4 border-b dark:border-slate-700 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-[#2F3E36] dark:text-slate-100">
                  {editingId ? "Edit Vaksinasi" : "Tambah Vaksinasi Baru"}
                </h2>
              </div>
              <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36] dark:text-slate-200">Pilih Pet <span className="text-red-500">*</span></label>
                <select
                  name="pet_id"
                  value={formData.pet_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100"
                  required
                >
                  <option value="" className="dark:bg-[#1e293b]">-- Pilih Hewan Peliharaan --</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id} className="dark:bg-[#1e293b]">
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="vaccine_name"
                  placeholder="Nama Vaksin *"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                  required
                />
                
                <input
                  type="text"
                  name="doctor"
                  placeholder="Nama Dokter"
                  value={formData.doctor}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                />
                
                <div>
                  <label className="block text-xs text-gray-500 dark:text-slate-400 mb-1">Tanggal Vaksin *</label>
                  <input
                    type="date"
                    name="vaccine_date"
                    value={formData.vaccine_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 dark:text-slate-400 mb-1">Tanggal Vaksin Berikutnya</label>
                  <input
                    type="date"
                    name="next_vaccine_date"
                    value={formData.next_vaccine_date}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFormData({ ...formData, next_vaccine_date: newValue });
                      if (formData.vaccine_date && newValue) {
                        if (newValue <= formData.vaccine_date) {
                          setDateError("Tanggal vaksin berikutnya harus setelah tanggal vaksinasi");
                        } else {
                          setDateError("");
                        }
                      }
                    }}
                    min={formData.vaccine_date ? (() => {
                      const [year, month, day] = formData.vaccine_date.split('-');
                      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                      date.setDate(date.getDate() + 1);
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      return `${y}-${m}-${d}`;
                    })() : ""}
                    className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 ${
                      dateError ? "border-red-400 bg-red-50 dark:bg-red-950/20" : "border-gray-200 dark:border-slate-600 focus:border-[#7A9D82]"
                    }`}
                  />
                  {dateError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {dateError}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36] dark:text-slate-200">Catatan</label>
                <textarea
                  name="notes"
                  placeholder="Catatan tambahan (opsional)"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none resize-none bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all"
                >
                  {editingId ? "Update Vaksin" : "Tambah Vaksin"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Vaccinations;
