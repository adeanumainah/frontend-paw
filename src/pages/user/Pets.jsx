import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getPets, createPet, updatePet, deletePet } from "../../services/petService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { 
  PawPrint, 
  Dog, 
  Cat, 
  Rabbit, 
  Bird, 
  Fish, 
  Search, 
  X, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Weight, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const getSpeciesIcon = (species) => {
  const s = (species || "").toLowerCase();
  if (s.includes("kucing") || s.includes("cat")) return <Cat className="w-5 h-5" />;
  if (s.includes("anjing") || s.includes("dog")) return <Dog className="w-5 h-5" />;
  if (s.includes("kelinci") || s.includes("rabbit")) return <Rabbit className="w-5 h-5" />;
  if (s.includes("burung") || s.includes("bird")) return <Bird className="w-5 h-5" />;
  if (s.includes("ikan") || s.includes("fish")) return <Fish className="w-5 h-5" />;
  return <PawPrint className="w-5 h-5" />;
};

const genderBadge = (gender) => {
  if (!gender) return null;
  const isMale = gender === "Male" || gender === "male";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
        ${isMale
          ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
          : "bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300"}`}
    >
      {isMale ? "Jantan" : "Betina"}
    </span>
  );
};

function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [speciesList, setSpeciesList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", species: "", breed: "", gender: "", age: "", weight: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => { fetchPets(); fetchSpeciesList(); }, [search, species, page]);

  const fetchSpeciesList = async () => {
    try {
      const response = await getPets(1, "", "");
      setSpeciesList([...new Set(response.data.map((p) => p.species))]);
    } catch (e) { console.log(e); }
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getPets(page, search, species);
      setPets(response.data);
      setPagination(response.pagination);
    } catch (e) {
      toast.error("Gagal memuat data pets");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", species: "", breed: "", gender: "", age: "", weight: "" });
    setPhotoFile(null);
    setPhotoPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.species) {
      toast.warning("Nama dan species wajib diisi!");
      return;
    }
    try {
      setUploading(true);
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
      if (photoFile) submitData.append("photo", photoFile);

      if (editingId) {
        await updatePet(editingId, submitData);
        toast.success("Data pet berhasil diperbarui!");
      } else {
        await createPet(submitData);
        toast.success("Pet baru berhasil ditambahkan!");
      }
      resetForm();
      setShowFormModal(false);
      fetchPets();
      fetchSpeciesList();
    } catch (e) {
      toast.error(e.response?.data?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingId(pet.id);
    setFormData({
      name: pet.name || "", species: pet.species || "", breed: pet.breed || "",
      gender: pet.gender || "", age: pet.age || "", weight: pet.weight || "",
    });
    setPhotoPreview(pet.photo ? `http://localhost:3000/uploads/pets/${pet.photo}` : "");
    setShowFormModal(true);
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Hapus ${name}?`,
      text: "Data pet ini akan dihapus permanen dan tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#7A9D82",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      await deletePet(id);
      toast.success(`${name} berhasil dihapus.`);
      fetchPets();
      fetchSpeciesList();
    } catch (e) {
      toast.error("Gagal menghapus pet.");
    }
  };

  const getPhotoUrl = (photo) =>
    photo ? `http://localhost:3000/uploads/pets/${photo}` : null;

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

      {/* Background utama - Slate gelap untuk dark mode (sama seperti dashboard) */}
      <div className="min-h-screen transition-colors duration-300 pt-8"
 style={{
   backgroundColor:"var(--bg-app)",
   color:"var(--text-app)"
 }}>
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Card */}
          <div className="relative mb-8 bg-linear-to-r from-[#7A9D82] to-[#8AAD92] dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-white shadow-lg transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-xl">
                    <PawPrint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">My Pets Gallery</h1>
                    <p className="text-sm text-white/80 mt-0.5">
                      Kelola data hewan peliharaan Anda dengan mudah
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { resetForm(); setShowFormModal(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-700 text-[#7A9D82] dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Pet Baru
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari nama pet..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                />
              </div>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
              >
                <option value="" className="dark:bg-slate-800">Semua Species</option>
                {speciesList.map((s) => (
                  <option key={s} value={s} className="dark:bg-slate-800">{s}</option>
                ))}
              </select>
              {(search || species) && (
                <button
                  onClick={() => { setSearch(""); setSpecies(""); setPage(1); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 text-sm"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Pets Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 dark:border-slate-700 border-t-[#7A9D82] rounded-full animate-spin"></div>
            </div>
          ) : pets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="
group
bg-white
dark:bg-slate-800
rounded-2xl
overflow-hidden
border border-gray-100
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
                    {/* Foto Section */}
                    <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-slate-900">
                      {pet.photo ? (
                        <img
                          src={getPhotoUrl(pet.photo)}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-600">
                          {getSpeciesIcon(pet.species)}
                          <span className="text-xs">Tidak ada foto</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm">
                        {pet.species}
                      </div>
                    </div>

                    {/* Informasi Pet */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="truncate mr-2">
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#7A9D82] dark:group-hover:text-emerald-400 transition-colors truncate">
                            {pet.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
                            {pet.breed || "Ras tidak spesifik"}
                          </p>
                        </div>
                        <div className="shrink-0">{genderBadge(pet.gender)}</div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-slate-400 mt-2">
                        {pet.age && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{pet.age} Tahun</span>
                          </div>
                        )}
                        {pet.weight && (
                          <div className="flex items-center gap-1">
                            <Weight className="w-3.5 h-3.5" />
                            <span>{pet.weight} Kg</span>
                          </div>
                        )}
                      </div>

                      {/* Tombol Aksi */}
                      <div className="flex gap-2 mt-5 pt-3 border-t border-gray-100 dark:border-slate-700 w-full">
                        <button
                          onClick={() => { setSelectedPet(pet); setShowDetailModal(true); }}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(pet)}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pet.id, pet.name)}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50"
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
                <div className="mt-10 pt-4 flex justify-center items-center gap-2 flex-wrap">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" />
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
                            ? "bg-[#7A9D82] text-white"
                            : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  ))}
                  
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-sm"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="bg-gray-100 dark:bg-slate-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-6 h-6 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Belum ada data pet</h3>
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">Gunakan tombol di atas untuk menambah peliharaan pertama Anda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form - Dark mode support */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {editingId ? "Edit Data Pet" : "Tambah Pet Baru"}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 text-xl font-medium transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Upload area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500 dark:text-slate-400">Foto Profil Pet</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400 dark:text-slate-600" />
                    )}
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-4 cursor-pointer hover:border-[#7A9D82] dark:hover:border-emerald-500 transition-all bg-transparent">
                    <Upload className="w-5 h-5 text-gray-400 dark:text-slate-500 mb-1" />
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{photoFile ? photoFile.name : "Pilih file gambar"}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Input fields grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Nama Pet <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama lengkap peliharaan"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Spesies <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="species"
                    placeholder="Contoh: Anjing, Kucing, Burung"
                    value={formData.species}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Ras / Breed</label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="Contoh: Persia, Golden Retriever"
                    value={formData.breed}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Jenis Kelamin</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                  >
                    <option value="" className="dark:bg-slate-800">Pilih Jenis Kelamin</option>
                    <option value="Male" className="dark:bg-slate-800">Jantan (Male)</option>
                    <option value="Female" className="dark:bg-slate-800">Betina (Female)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Umur (Tahun)</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Contoh: 2"
                    value={formData.age}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-slate-400 pl-1">Berat Badan (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    placeholder="Contoh: 4.5"
                    value={formData.weight}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-gray-800 dark:text-white focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] hover:bg-[#6A8B71] text-white font-bold transition-all disabled:opacity-50 text-sm shadow-sm"
                >
                  {uploading ? "Menyimpan data..." : (editingId ? "Simpan Perubahan" : "Simpan Pet")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal - Dark mode support */}
      {showDetailModal && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-900">
              {selectedPet.photo ? (
                <img src={getPhotoUrl(selectedPet.photo)} alt={selectedPet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-600">
                  {getSpeciesIcon(selectedPet.species)}
                </div>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center text-xl font-light hover:bg-black/60 transition"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedPet.name}</h3>
                  <p className="text-xs text-[#7A9D82] dark:text-emerald-400 font-semibold mt-0.5 uppercase tracking-wide">{selectedPet.species}</p>
                </div>
                {genderBadge(selectedPet.gender)}
              </div>

              <div className="space-y-2.5 mb-5 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Ras / Breed</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPet.breed || "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Umur</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPet.age ? `${selectedPet.age} Tahun` : "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-slate-400">Berat</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPet.weight ? `${selectedPet.weight} Kg` : "-"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDetailModal(false); handleEdit(selectedPet); }}
                  className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-all text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); handleDelete(selectedPet.id, selectedPet.name); }}
                  className="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all text-xs font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pets;
