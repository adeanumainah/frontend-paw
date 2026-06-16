// pages/admin/AdminPets.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { getAdminPets, deletePetAdmin } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Dog, 
  Cat, 
  Rabbit, 
  Bird, 
  Fish, 
  PawPrint,
  User as UserIcon,
  Calendar,
  Weight,
  Heart,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Fungsi icon species tanpa emoji
const SpeciesIcon = ({ species }) => {
  const s = (species || "").toLowerCase();
  const iconClass = "w-5 h-5 text-[#7A9D82]";
  
  if (s.includes("kucing") || s.includes("cat")) return <Cat className={iconClass} />;
  if (s.includes("anjing") || s.includes("dog")) return <Dog className={iconClass} />;
  if (s.includes("kelinci") || s.includes("rabbit")) return <Rabbit className={iconClass} />;
  if (s.includes("burung") || s.includes("bird")) return <Bird className={iconClass} />;
  if (s.includes("ikan") || s.includes("fish")) return <Fish className={iconClass} />;
  return <PawPrint className={iconClass} />;
};

const GenderBadge = ({ gender }) => {
  if (!gender) return null;
  const isMale = gender === "Male" || gender === "male";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
      isMale ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
    }`}>
      {isMale ? "Jantan" : "Betina"}
    </span>
  );
};

function AdminPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    fetchPets();
  }, [page, search, species]);

  useEffect(() => {
    if (pets.length > 0) {
      setSpeciesList([...new Set(pets.map(p => p.species))]);
    }
  }, [pets]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getAdminPets(page, search, species);
      setPets(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Gagal memuat data pets");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setShowDetailModal(true);
  };

  const getPhotoUrl = (photo) => photo ? `http://localhost:3000/uploads/pets/${photo}` : null;

  const getGenderText = (gender) => {
    if (!gender) return "-";
    return gender.toLowerCase() === "male" ? "Jantan" : "Betina";
  };

  // Pagination helper
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
            <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
              <Dog className="w-6 h-6 text-[#7A9D82]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2F3E36]">Pet Management</h1>
          </div>
          <p className="text-[#2F3E36]/60">Pantau seluruh hewan peliharaan pengguna (hanya baca)</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2F3E36]/50 text-sm">Total Pets</p>
                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
              </div>
              <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                <Dog className="w-5 h-5 text-[#7A9D82]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#2F3E36]/50 text-sm">Total Species</p>
                <p className="text-2xl font-bold text-[#2F3E36]">{speciesList.length}</p>
              </div>
              <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                <PawPrint className="w-5 h-5 text-[#7A9D82]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama pet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
              />
            </div>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
            >
              <option value="">Semua Species</option>
              {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {(search || species) && (
              <button
                onClick={() => { setSearch(""); setSpecies(""); setPage(1); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        

        {/* Pets Grid */}
        {loading ? (
          <Loading />
        ) : pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {pets.map(pet => (
                <div key={pet.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
                  {/* Image Section */}
                  <div className="relative h-48 bg-linear-to-br from-[#7A9D82]/10 to-[#8AAD92]/10 overflow-hidden">
                    {pet.photo ? (
                      <img src={getPhotoUrl(pet.photo)} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <SpeciesIcon species={pet.species} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-[#2F3E36]">
                      {pet.species}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-[#2F3E36]">{pet.name}</h3>
                      <GenderBadge gender={pet.gender} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Pemilik: {pet.username}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                      {pet.age && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{pet.age} tahun</span>
                        </div>
                      )}
                      {pet.weight && (
                        <div className="flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          <span>{pet.weight} kg</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleViewDetail(pet)}
                      className="w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-[#7A9D82]/10 text-[#7A9D82] hover:bg-[#7A9D82] hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Fixed dengan background dan tidak terpotong */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 pt-4 pb-6 bg-[#F9F6F0] border-t border-gray-200">
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
                  Menampilkan {((page - 1) * (pagination.limit || 12)) + 1} - {Math.min(page * (pagination.limit || 12), pagination.total || 0)} dari {pagination.total || 0} data
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dog className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E36]">Tidak ada data pet</h3>
            <p className="text-gray-400 text-sm mt-1">Belum ada hewan peliharaan yang terdaftar</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-linear-to-r from-[#7A9D82] to-[#8AAD92] text-white rounded-t-2xl px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Detail Pet</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-white text-2xl hover:opacity-80">×</button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-center -mt-10 mb-4">
                <div className="w-24 h-24 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
                  {selectedPet.photo ? (
                    <img src={getPhotoUrl(selectedPet.photo)} alt={selectedPet.name} className="w-full h-full object-cover" />
                  ) : (
                    <SpeciesIcon species={selectedPet.species} />
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Nama Pet</span>
                  <span className="font-medium text-sm">{selectedPet.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Species</span>
                  <span className="font-medium text-sm">{selectedPet.species}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Ras / Breed</span>
                  <span className="font-medium text-sm">{selectedPet.breed || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Jenis Kelamin</span>
                  <span className="font-medium text-sm">{getGenderText(selectedPet.gender)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Umur</span>
                  <span className="font-medium text-sm">{selectedPet.age ? `${selectedPet.age} tahun` : "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Berat</span>
                  <span className="font-medium text-sm">{selectedPet.weight ? `${selectedPet.weight} kg` : "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Pemilik</span>
                  <span className="font-medium text-sm">{selectedPet.username}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500 text-sm">Deskripsi</span>
                  <span className="font-medium text-sm break-all text-right max-w-[60%]">{selectedPet.description || "-"}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t">
              <button onClick={() => setShowDetailModal(false)} className="w-full py-2.5 rounded-xl bg-[#7A9D82] text-white hover:bg-[#8AAD92] transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPets;
