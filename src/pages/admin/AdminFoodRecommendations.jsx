// pages/admin/AdminFoodRecommendations.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import {
    getAdminFoods,
    createFood,
    updateFood,
    deleteFood,
} from "../../services/foodService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  UtensilsCrossed, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2,
  Plus,
  Star,
  DollarSign,
  Image,
  AlignLeft,
  Link as LinkIcon,
  Activity,
  Cat,
  Dog,
  Rabbit,
  Bird,
  Fish
} from "lucide-react";

function AdminFoodRecommendations() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        brand_name: "",
        product_name: "",
        species: "cat",
        life_stage: "all",
        price_range: "",
        image_url: "",
        affiliate_link: "",
        rating: 0,
        description: "",
        is_active: true
    });

    const speciesOptions = [
        { value: "cat", label: "Kucing", icon: Cat },
        { value: "dog", label: "Anjing", icon: Dog },
        { value: "bird", label: "Burung", icon: Bird },
        { value: "hamster", label: "Hamster", icon: Rabbit },
        { value: "rabbit", label: "Kelinci", icon: Rabbit },
        { value: "fish", label: "Ikan", icon: Fish },
        { value: "reptile", label: "Reptil", icon: Rabbit },
        { value: "both", label: "Kucing & Anjing", icon: Cat }
    ];

    useEffect(() => {
        fetchFoods();
    }, [page, search, speciesFilter]);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await getAdminFoods(page, search, speciesFilter);
            setFoods(response.data);
            setPagination(response.pagination);
        } catch (error) {
            toast.error("Gagal memuat data rekomendasi makanan");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.brand_name.trim()) newErrors.brand_name = "Nama brand wajib diisi";
        if (!formData.species) newErrors.species = "Species wajib dipilih";
        if (formData.rating < 0 || formData.rating > 5) newErrors.rating = "Rating harus antara 0 - 5";
        if (formData.image_url && !/^https?:\/\//.test(formData.image_url)) {
            newErrors.image_url = "URL gambar harus diawali http:// atau https://";
        }
        if (formData.affiliate_link && !/^https?:\/\//.test(formData.affiliate_link)) {
            newErrors.affiliate_link = "Link afiliasi harus diawali http:// atau https://";
        }
        if (formData.price_range && /[a-zA-Z]/g.test(formData.price_range.replace(/[Rp\s,.-]/g, ''))) {
            // Validasi price range sebaiknya tetap string karena bisa format "Rp 50.000 - 100.000"
            // Tidak perlu validasi ketat
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        
        // Validasi rating khusus
        if (e.target.name === "rating") {
            value = parseFloat(value);
            if (isNaN(value)) value = 0;
            if (value > 5) value = 5;
            if (value < 0) value = 0;
        }
        
        setFormData({ ...formData, [e.target.name]: value });
        
        if (e.target.name === "image_url") {
            setPreviewUrl(value);
        }
        
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setPreviewUrl("");
        setErrors({});
        setFormData({
            brand_name: "",
            product_name: "",
            species: "cat",
            life_stage: "all",
            price_range: "",
            image_url: "",
            affiliate_link: "",
            rating: 0,
            description: "",
            is_active: true
        });
        setShowFormModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.warning("Mohon lengkapi data yang diperlukan");
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                await updateFood(editingId, formData);
                toast.success("Rekomendasi makanan berhasil diupdate!");
            } else {
                await createFood(formData);
                toast.success("Rekomendasi makanan berhasil ditambahkan!");
            }
            resetForm();
            fetchFoods();
        } catch (error) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (food) => {
        setEditingId(food.id);
        setPreviewUrl(food.image_url || "");
        setErrors({});
        setFormData({
            brand_name: food.brand_name,
            product_name: food.product_name || "",
            species: food.species,
            life_stage: food.life_stage || "all",
            price_range: food.price_range || "",
            image_url: food.image_url || "",
            affiliate_link: food.affiliate_link || "",
            rating: food.rating || 0,
            description: food.description || "",
            is_active: food.is_active
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id, brand_name) => {
        const result = await Swal.fire({
            title: "Hapus Rekomendasi?",
            html: `Apakah Anda yakin ingin menghapus rekomendasi <strong>${brand_name}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#7A9D82",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteFood(id);
            toast.success("Rekomendasi makanan berhasil dihapus!");
            fetchFoods();
        } catch (error) {
            toast.error("Gagal menghapus rekomendasi");
        }
    };

    const getRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                {hasHalfStar && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" style={{ clipPath: "inset(0 50% 0 0)" }} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
                ))}
                <span className="text-xs text-gray-500 ml-1">({rating})</span>
            </div>
        );
    };

    const getSpeciesIcon = (species) => {
        const found = speciesOptions.find(s => s.value === species);
        if (found && found.icon) {
            const IconComponent = found.icon;
            return <IconComponent className="w-3.5 h-3.5" />;
        }
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
    };

    const getSpeciesLabel = (species) => {
        const found = speciesOptions.find(s => s.value === species);
        return found ? found.label : species;
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
                            <UtensilsCrossed className="w-6 h-6 text-[#7A9D82]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2F3E36]">Food Recommendations</h1>
                            <p className="text-sm text-[#2F3E36]/60">Kelola rekomendasi makanan untuk hewan peliharaan</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Total Rekomendasi</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
                            </div>
                            <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                                <UtensilsCrossed className="w-5 h-5 text-[#7A9D82]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Untuk Kucing</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{foods.filter(f => f.species === "cat" || f.species === "both").length}</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-xl">
                                <Cat className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Untuk Anjing</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{foods.filter(f => f.species === "dog" || f.species === "both").length}</p>
                            </div>
                            <div className="bg-amber-50 p-2 rounded-xl">
                                <Dog className="w-5 h-5 text-amber-600" />
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

                {/* Search & Filter + Add Button */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan brand atau produk..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                            />
                        </div>
                        <select
                            value={speciesFilter}
                            onChange={(e) => { setSpeciesFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                        >
                            <option value="">Semua Species</option>
                            {speciesOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        {(search || speciesFilter) && (
                            <button
                                onClick={() => { setSearch(""); setSpeciesFilter(""); setPage(1); }}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Reset
                            </button>
                        )}
                        <button
                            onClick={() => { resetForm(); setShowFormModal(true); }}
                            className="px-5 py-2.5 rounded-xl bg-[#7A9D82] text-white font-medium hover:bg-[#E2A76F] transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Rekomendasi
                        </button>
                    </div>
                </div>

                {/* Foods Grid */}
                {loading ? (
                    <Loading />
                ) : foods.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {foods.map(food => (
                                <div key={food.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
                                    <div className="h-1 bg-linear-to-r from-amber-500 to-orange-500"></div>
                                    
                                    <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#7A9D82]/10 to-[#8AAD92]/10">
                                        {food.image_url ? (
                                            <img src={food.image_url} alt={food.brand_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UtensilsCrossed className="w-10 h-10 text-[#7A9D82]/40" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm flex items-center gap-1">
                                            {getSpeciesIcon(food.species)}
                                            <span>{getSpeciesLabel(food.species)}</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-[#2F3E36]">{food.brand_name}</h3>
                                            {food.product_name && (
                                                <p className="text-sm text-gray-500">{food.product_name}</p>
                                            )}
                                        </div>
                                        
                                        <div className="mt-2">
                                            {getRatingStars(food.rating)}
                                        </div>
                                        
                                        {food.price_range && (
                                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                <span>{food.price_range}</span>
                                            </div>
                                        )}
                                        
                                        {food.description && (
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{food.description}</p>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(food)}
                                                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food.id, food.brand_name)}
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
                            <UtensilsCrossed className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2F3E36]">Belum ada rekomendasi makanan</h3>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan rekomendasi makanan pertama Anda</p>
                        <button
                            onClick={() => { resetForm(); setShowFormModal(true); }}
                            className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
                        >
                            + Tambah Rekomendasi
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-[#2F3E36]">
                                    {editingId ? "Edit Food Recommendation" : "Tambah Food Recommendation"}
                                </h2>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 text-xl transition">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Nama Brand <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="brand_name"
                                        value={formData.brand_name}
                                        onChange={handleChange}
                                        placeholder="Contoh: Royal Canin, Whiskas, dll"
                                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                            errors.brand_name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                    {errors.brand_name && <p className="text-red-500 text-xs mt-1">{errors.brand_name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Nama Produk</label>
                                    <input
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        placeholder="Contoh: Kitten 36, Adult, dll"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Untuk Species <span className="text-red-500">*</span></label>
                                    <select
                                        name="species"
                                        value={formData.species}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 bg-white ${
                                            errors.species ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    >
                                        {speciesOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Tahap Usia</label>
                                    <select
                                        name="life_stage"
                                        value={formData.life_stage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                                    >
                                        <option value="all">Semua Usia</option>
                                        <option value="puppy">Anak (Puppy/Kitten)</option>
                                        <option value="adult">Dewasa (Adult)</option>
                                        <option value="senior">Lansia (Senior)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Perkiraan Harga</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="price_range"
                                            value={formData.price_range}
                                            onChange={handleChange}
                                            placeholder="Contoh: Rp 50.000 - 100.000"
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Rating (0-5)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleChange}
                                            step="0.5"
                                            min="0"
                                            max="5"
                                            className={`w-24 px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                                errors.rating ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                            }`}
                                        />
                                        <div className="flex items-center gap-0.5">
                                            {getRatingStars(formData.rating)}
                                        </div>
                                    </div>
                                    {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">URL Gambar Produk</label>
                                <div className="relative">
                                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                            errors.image_url ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                </div>
                                {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
                                {previewUrl && !errors.image_url && (
                                    <div className="mt-2">
                                        <img src={previewUrl} alt="Preview" className="h-16 rounded-lg object-cover border border-gray-200" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Link Afiliasi</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="affiliate_link"
                                        value={formData.affiliate_link}
                                        onChange={handleChange}
                                        placeholder="https://tokopedia.com/..."
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                            errors.affiliate_link ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                </div>
                                {errors.affiliate_link && <p className="text-red-500 text-xs mt-1">{errors.affiliate_link}</p>}
                                <p className="text-xs text-gray-400 mt-1">User akan diarahkan ke link ini saat klik "Beli"</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Deskripsi Produk</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Deskripsi singkat tentang produk ini..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Menyimpan..." : (editingId ? "Update" : "Tambah")}
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

export default AdminFoodRecommendations;
