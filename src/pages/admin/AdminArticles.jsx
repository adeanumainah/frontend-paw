// pages/admin/AdminArticles.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import {
    getAdminArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories
} from "../../services/articleService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Newspaper, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Link as LinkIcon,
  Calendar,
  Image,
  AlignLeft,
  CheckCircle,
  XCircle,
  Activity
} from "lucide-react";

function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        external_link: "",
        image_url: "",
        category: "",
        published_at: "",
        is_published: true
    });

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, [page, search, categoryFilter]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await getAdminArticles(page, search, categoryFilter);
            setArticles(response.data);
            setPagination(response.pagination);
        } catch (error) {
            toast.error("Gagal memuat data artikel");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Judul artikel wajib diisi";
        if (!formData.external_link.trim()) newErrors.external_link = "Link artikel wajib diisi";
        if (!formData.category) newErrors.category = "Kategori wajib dipilih";
        if (formData.external_link && !/^https?:\/\//.test(formData.external_link)) {
            newErrors.external_link = "Link harus diawali http:// atau https://";
        }
        if (formData.image_url && !/^https?:\/\//.test(formData.image_url)) {
            newErrors.image_url = "URL gambar harus diawali http:// atau https://";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setErrors({});
        setFormData({
            title: "",
            summary: "",
            external_link: "",
            image_url: "",
            category: "",
            published_at: new Date().toISOString().split("T")[0],
            is_published: true
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
                await updateArticle(editingId, formData);
                toast.success("Artikel berhasil diupdate!");
            } else {
                await createArticle(formData);
                toast.success("Artikel berhasil ditambahkan!");
            }
            resetForm();
            fetchArticles();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (article) => {
        setEditingId(article.id);
        setErrors({});
        setFormData({
            title: article.title,
            summary: article.summary || "",
            external_link: article.external_link,
            image_url: article.image_url || "",
            category: article.category,
            published_at: article.published_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            is_published: article.is_published
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: "Hapus Artikel?",
            html: `Apakah Anda yakin ingin menghapus artikel <strong>${title}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#7A9D82",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteArticle(id);
            toast.success("Artikel berhasil dihapus!");
            fetchArticles();
        } catch (error) {
            toast.error("Gagal menghapus artikel");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const categoryColors = {
        Kesehatan: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Nutrisi: "bg-blue-50 text-blue-700 border-blue-200",
        Perawatan: "bg-purple-50 text-purple-700 border-purple-200",
        Perilaku: "bg-amber-50 text-amber-700 border-amber-200",
        Lainnya: "bg-gray-50 text-gray-600 border-gray-200"
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
                            <Newspaper className="w-6 h-6 text-[#7A9D82]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2F3E36]">Artikel Management</h1>
                            <p className="text-sm text-[#2F3E36]/60">Kelola artikel rekomendasi untuk pengguna</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Total Artikel</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
                            </div>
                            <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                                <Newspaper className="w-5 h-5 text-[#7A9D82]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Total Kategori</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{categories.length}</p>
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
                                placeholder="Cari artikel berdasarkan judul..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {(search || categoryFilter) && (
                            <button
                                onClick={() => { setSearch(""); setCategoryFilter(""); setPage(1); }}
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
                            Tambah Artikel
                        </button>
                    </div>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <Loading />
                ) : articles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {articles.map(article => (
                                <div key={article.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
                                    <div className="relative h-44 overflow-hidden bg-linear-to-br from-[#7A9D82]/10 to-[#8AAD92]/10">
                                        {article.image_url ? (
                                            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="w-12 h-12 text-[#7A9D82]/40" />
                                            </div>
                                        )}
                                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold border ${categoryColors[article.category] || categoryColors.Lainnya}`}>
                                            {article.category}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-[#2F3E36] line-clamp-2">{article.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(article.published_at)}</span>
                                        </div>
                                        
                                        {article.summary && (
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.summary}</p>
                                        )}
                                        
                                        <div className="flex items-center gap-2 mt-3">
                                            {article.is_published ? (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                    <XCircle className="w-3 h-3" />
                                                    Draft
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => window.open(article.external_link, "_blank")}
                                                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Lihat
                                            </button>
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id, article.title)}
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
                            <Newspaper className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2F3E36]">Belum ada artikel</h3>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan artikel rekomendasi pertama Anda</p>
                        <button
                            onClick={() => { resetForm(); setShowFormModal(true); }}
                            className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
                        >
                            + Tambah Artikel
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
                                    {editingId ? "Edit Artikel" : "Tambah Artikel Baru"}
                                </h2>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 text-xl transition">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Judul Artikel <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Contoh: Cara Merawat Kucing di Musim Hujan"
                                    className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                        errors.title ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                    }`}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Link Artikel <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="external_link"
                                        value={formData.external_link}
                                        onChange={handleChange}
                                        placeholder="https://www.example.com/artikel"
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                            errors.external_link ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                </div>
                                {errors.external_link && <p className="text-red-500 text-xs mt-1">{errors.external_link}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Kategori <span className="text-red-500">*</span></label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 bg-white ${
                                            errors.category ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Kesehatan">Kesehatan</option>
                                        <option value="Nutrisi">Nutrisi</option>
                                        <option value="Perawatan">Perawatan</option>
                                        <option value="Perilaku">Perilaku</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Tanggal Terbit</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            name="published_at"
                                            value={formData.published_at}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">URL Gambar</label>
                                <div className="relative">
                                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/..."
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                            errors.image_url ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                </div>
                                {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
                                {formData.image_url && !errors.image_url && (
                                    <div className="mt-2">
                                        <img src={formData.image_url} alt="Preview" className="h-16 rounded-lg object-cover border border-gray-200" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Ringkasan</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Tulis ringkasan singkat artikel..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#7A9D82] focus:ring-[#7A9D82]"
                                    />
                                    <span className="text-sm text-[#2F3E36]">Publikasikan sekarang</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Menyimpan..." : (editingId ? "Update Artikel" : "Tambah Artikel")}
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

export default AdminArticles;
