// pages/admin/AdminHealthTips.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import {
    getAdminTips,
    createTip,
    updateTip,
    deleteTip,
    // toggleTipStatus - HAPUS import ini karena tidak digunakan
} from "../../services/healthTipService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Lightbulb, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2,
  Plus,
  AlignLeft,
  CheckCircle,
  XCircle,
  Activity
} from "lucide-react";

function AdminHealthTips() {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        tip_content: "",
        priority: 1,
        is_active: true
    });

    useEffect(() => {
        fetchTips();
    }, [page, search, statusFilter]);

    const fetchTips = async () => {
        try {
            setLoading(true);
            const response = await getAdminTips(page, search, statusFilter);
            setTips(response.data);
            setPagination(response.pagination);
        } catch (error) {
            toast.error("Gagal memuat data tips");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Judul tips wajib diisi";
        if (!formData.tip_content.trim()) newErrors.tip_content = "Konten tips wajib diisi";
        if (formData.priority < 1 || formData.priority > 3) newErrors.priority = "Priority harus antara 1-3";
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
            tip_content: "",
            priority: 1,
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
                await updateTip(editingId, formData);
                toast.success("Tips berhasil diupdate!");
            } else {
                await createTip(formData);
                toast.success("Tips berhasil ditambahkan!");
            }
            resetForm();
            fetchTips();
        } catch (error) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (tip) => {
        setEditingId(tip.id);
        setErrors({});
        setFormData({
            title: tip.title,
            tip_content: tip.tip_content,
            priority: tip.priority,
            is_active: tip.is_active
        });
        setShowFormModal(true);
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: "Hapus Tips?",
            html: `Apakah Anda yakin ingin menghapus tips <strong>${title}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e53e3e",
            cancelButtonColor: "#7A9D82",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteTip(id);
            toast.success("Tips berhasil dihapus!");
            fetchTips();
        } catch (error) {
            toast.error("Gagal menghapus tips");
        }
    };

    const getPriorityLabel = (priority) => {
        if (priority === 1) return { label: "Tinggi", color: "bg-red-50 text-red-700 border-red-200" };
        if (priority === 2) return { label: "Sedang", color: "bg-amber-50 text-amber-700 border-amber-200" };
        return { label: "Normal", color: "bg-green-50 text-green-700 border-green-200" };
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
                            <Lightbulb className="w-6 h-6 text-[#7A9D82]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2F3E36]">Health Tips Management</h1>
                            <p className="text-sm text-[#2F3E36]/60">Kelola tips kesehatan singkat untuk pengguna</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Total Tips</p>
                                <p className="text-2xl font-bold text-[#2F3E36]">{pagination.total || 0}</p>
                            </div>
                            <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
                                <Lightbulb className="w-5 h-5 text-[#7A9D82]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#2F3E36]/50 text-sm">Tips Aktif</p>
                                <p className="text-2xl font-bold text-emerald-600">{tips.filter(t => t.is_active).length}</p>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
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
                                placeholder="Cari tips berdasarkan judul..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                        {(search || statusFilter !== "all") && (
                            <button
                                onClick={() => { setSearch(""); setStatusFilter("all"); setPage(1); }}
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
                            Tambah Tips
                        </button>
                    </div>
                </div>

                {/* Tips Grid */}
                {loading ? (
                    <Loading />
                ) : tips.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tips.map(tip => {
                                const priority = getPriorityLabel(tip.priority);
                                return (
                                    <div key={tip.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
                                        <div className={`h-1 ${tip.is_active ? "bg-linear-to-r from-[#7A9D82] to-[#8AAD92]" : "bg-gray-300"}`}></div>
                                        
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-[#2F3E36] line-clamp-2">{tip.title}</h3>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${priority.color}`}>
                                                    {priority.label}
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{tip.tip_content}</p>
                                            
                                            <div className="flex items-center gap-2 mt-3">
                                                {tip.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                        <XCircle className="w-3 h-3" />
                                                        Tidak Aktif
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400">Priority: {tip.priority}</span>
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                {/* HAPUS tombol toggle status - hanya Edit dan Hapus */}
                                                <button
                                                    onClick={() => handleEdit(tip)}
                                                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tip.id, tip.title)}
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
                            <Lightbulb className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2F3E36]">Belum ada tips kesehatan</h3>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan tips kesehatan pertama Anda</p>
                        <button
                            onClick={() => { resetForm(); setShowFormModal(true); }}
                            className="mt-4 px-5 py-2 rounded-xl bg-[#7A9D82] text-white hover:bg-[#E2A76F] transition-all"
                        >
                            + Tambah Tips
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
                                    {editingId ? "Edit Health Tips" : "Tambah Health Tips Baru"}
                                </h2>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 text-xl transition">
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Prioritas</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 bg-white ${
                                            errors.priority ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    >
                                        <option value={1}>Tinggi (Prioritas 1)</option>
                                        <option value={2}>Sedang (Prioritas 2)</option>
                                        <option value={3}>Normal (Prioritas 3)</option>
                                    </select>
                                    {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
                                    <p className="text-xs text-gray-400 mt-1">Priority 1 = Tampil paling atas</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Judul Tips <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Contoh: Tanda Bahaya pada Kucing"
                                    className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                                        errors.title ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                    }`}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-[#2F3E36]">Konten Tips <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        name="tip_content"
                                        value={formData.tip_content}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tulis tips kesehatan singkat di sini..."
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#7A9D82]/20 resize-none ${
                                            errors.tip_content ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                                        }`}
                                    />
                                </div>
                                {errors.tip_content && <p className="text-red-500 text-xs mt-1">{errors.tip_content}</p>}
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#7A9D82] focus:ring-[#7A9D82]"
                                    />
                                    <span className="text-sm text-[#2F3E36]">Aktifkan tips ini (akan tampil di dashboard user)</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 rounded-xl bg-[#7A9D82] text-white font-semibold hover:bg-[#E2A76F] transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Menyimpan..." : (editingId ? "Update Tips" : "Tambah Tips")}
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

export default AdminHealthTips;
