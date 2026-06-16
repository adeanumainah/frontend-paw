import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { getPets } from "../../services/petService";
import {
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../../services/medicalRecordService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { 
  FileText, 
  Search, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Dog,
  Activity,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Pill,
  Heart
} from "lucide-react";

function MedicalRecords() {
  const { darkMode } = useTheme();
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, byPet: {} });

  const [formData, setFormData] = useState({
    pet_id: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    record_date: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchPets();
  }, [page, search]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await getMedicalRecords(page, search);
      setRecords(response.data);
      setPagination(response.pagination || { totalPages: 1 });
      
      const total = response.data.length;
      const byPet = {};
      response.data.forEach(record => {
        byPet[record.pet_name] = (byPet[record.pet_name] || 0) + 1;
      });
      setStats({ total, byPet });
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data medical record");
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
      diagnosis: "",
      treatment: "",
      notes: "",
      record_date: "",
    });
    setShowFormModal(false);
  };


const handleEdit = (record) => {
  setEditingId(record.id);
  setFormData({
    pet_id: record.pet_id,
    diagnosis: record.diagnosis || "",
    treatment: record.treatment || "",
    notes: record.notes || "",
    record_date: record.record_date || "",
  });
  setShowFormModal(true);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.pet_id || !formData.diagnosis || !formData.record_date) {
    toast.warning("Pet, diagnosis, dan tanggal wajib diisi!");
    return;
  }

  try {

    if (editingId) {
      await updateMedicalRecord(editingId, formData);
      toast.success("Medical record berhasil diupdate!");
    } else {
      await createMedicalRecord(formData);
      toast.success("Medical record berhasil ditambahkan!");
    }
    resetForm();
    fetchRecords();
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Terjadi kesalahan");
  }
};

// PERBAIKI formatDate seperti di schedules
const formatDate = (dateString) => {
  if (!dateString) return "-";
  // Gunakan split('T')[0] seperti di schedules
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


  const handleDelete = async (id, diagnosis) => {
    const result = await Swal.fire({
      title: "Hapus Medical Record?",
      html: `Apakah Anda yakin ingin menghapus record <strong>${diagnosis}</strong>?`,
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
      await deleteMedicalRecord(id);
      toast.success("Medical record berhasil dihapus!");
      fetchRecords();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus medical record");
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

      <div className={`min-h-screen py-8 transition-colors duration-300 ${
    darkMode
      ? "bg-linear-to-br from-slate-900 via-blue-950 to-slate-900"
      : "bg-[#F9F6F0]"
  }`}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="relative mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#7A9D82]/10 p-2.5 rounded-xl">
                    <FileText className="w-6 h-6 text-[#7A9D82]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#2F3E36]">Riwayat Medis</h1>
                    <p className="text-sm text-[#2F3E36]/60 mt-0.5">
                      Catatan kesehatan dan riwayat medis hewan peliharaan Anda
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { resetForm(); setShowFormModal(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A9D82] text-white font-medium hover:bg-[#E2A76F] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Tambah Record Medis
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
    darkMode
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-100"
  }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
                </div>
                <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                  <FileText className="w-5 h-5 text-[#7A9D82]" />
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
    darkMode
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-100"
  }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Total Pet</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">{pets.length}</p>
                </div>
                <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                  <Dog className="w-5 h-5 text-[#7A9D82]" />
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
    darkMode
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-100"
  }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Pet dengan Record</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">{Object.keys(stats.byPet).length}</p>
                </div>
                <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                  <Heart className="w-5 h-5 text-[#7A9D82]" />
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
    darkMode
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-100"
  }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2F3E36]/50 text-sm">Record Terbanyak</p>
                  <p className="text-2xl font-bold text-[#2F3E36]">
                    {Object.values(stats.byPet).reduce((a, b) => Math.max(a, b), 0)}
                  </p>
                </div>
                <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                  <Activity className="w-5 h-5 text-[#7A9D82]" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan diagnosis, treatment, atau nama pet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Records Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-[#7A9D82]/20 border-t-[#7A9D82] rounded-full animate-spin"></div>
              </div>
            </div>
          ) : records.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {records.map((record) => (
                  <div key={record.id} className={`group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 ${
    darkMode
      ? "bg-slate-800 border border-slate-700"
      : "bg-white border border-gray-100"
  }`}>
                    <div className="h-1 bg-linear-to-r from-[#7A9D82] to-[#8AAD92]"></div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Stethoscope className="w-4 h-4 text-[#7A9D82]" />
                            <h3 className="font-bold text-lg text-[#2F3E36]">{record.diagnosis}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Dog className="w-3.5 h-3.5" />
                            <span>{record.pet_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        {record.treatment && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Pill className="w-3.5 h-3.5" />
                            <span>Treatment: {record.treatment}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Tanggal: {formatDate(record.record_date)}</span>
                        </div>
                        {record.notes && (
                          <div className="flex items-start gap-2 text-gray-500 mt-2 pt-2 border-t border-gray-100">
                            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="text-xs">{record.notes}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id, record.diagnosis)}
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
                    Menampilkan {((page - 1) * 6) + 1} - {Math.min(page * 6, pagination.total || 0)} dari {pagination.total || 0} data
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#2F3E36]">Belum Ada Data Medical Record</h3>
              <p className="text-gray-400 text-sm mt-1">Tambahkan riwayat medis hewan peliharaan Anda</p>
              <button
                onClick={() => { resetForm(); setShowFormModal(true); }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
              >
                + Tambah Record Medis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#2F3E36]">
                  {editingId ? "Edit Medical Record" : "Tambah Medical Record Baru"}
                </h2>
              </div>
              <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2F3E36]">Pilih Pet <span className="text-red-500">*</span></label>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tanggal Record *</label>
                  <input
                    type="date"
                    name="record_date"
                    value={formData.record_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                    required
                  />
                </div>
                
                <input
                  type="text"
                  name="diagnosis"
                  placeholder="Diagnosis *"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                  required
                />
                
                <input
                  type="text"
                  name="treatment"
                  placeholder="Treatment / Pengobatan"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                />
                
                <div className="md:col-span-2">
                  <textarea
                    name="notes"
                    placeholder="Catatan tambahan (opsional)"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all"
                >
                  {editingId ? "Update Record" : "Tambah Record"}
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
    </>
  );
}

export default MedicalRecords;
