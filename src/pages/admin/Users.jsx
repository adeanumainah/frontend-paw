// pages/admin/Users.js - Bagian return, tambahkan pb-32
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { getUsers, deleteUser } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Users as UsersIcon, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Eye,
  Trash2,
  Search,
  X,
  Crown,
  UserCircle
} from "lucide-react";

const getRoleBadge = (role) => {
  if (role === "admin") {
    return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
  }
  return "bg-gradient-to-r from-emerald-600 to-teal-600 text-white";
};

const getProfilePhotoUrl = (photo) => {
  if (!photo) return null;
  return `http://localhost:3000/uploads/profiles/${photo}`;
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentAdminId(user.id);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(search);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username, role) => {
    if (id === currentAdminId) {
      Swal.fire({
        title: "Tidak Dapat Menghapus Diri Sendiri",
        text: "Anda tidak dapat menghapus akun Anda sendiri. Hubungi admin lain jika diperlukan.",
        icon: "error",
        confirmButtonColor: "#7A9D82",
        confirmButtonText: "Mengerti",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Hapus User ${username}?`,
      html: `<div class="text-left">
        <p class="mb-3">Akun ini hanya bisa dihapus jika:</p>
        <ul class="list-disc list-inside space-y-1 text-gray-600 mb-3">
          <li>Terjadi masalah pada user (pelanggaran, spam, dll)</li>
          <li>Akun sudah tidak digunakan lagi (inaktif)</li>
        </ul>
        <p class="font-semibold text-red-600">Apakah kedua syarat tersebut terpenuhi?</p>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#7A9D82",
      confirmButtonText: "Ya, Hapus User",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);
      toast.success(`User ${username} berhasil dihapus`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* TAMBAHKAN pb-32 untuk padding bottom yang cukup */}
      <div className="p-6 pb-32">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#7A9D82]/10 p-2 rounded-xl">
              <UsersIcon className="w-6 h-6 text-[#7A9D82]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2F3E36]">Users Management</h1>
          </div>
          <p className="text-[#2F3E36]/60">Kelola seluruh pengguna aplikasi</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari username atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all outline-none"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <Loading />
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user) => (
              <div
                key={user.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                <div className={`h-1 ${user.role === "admin" ? "bg-linear-to-r from-amber-500 to-orange-500" : "bg-linear-to-r from-emerald-500 to-teal-500"}`}></div>

                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#7A9D82]/20 to-[#8AAD92]/20 flex items-center justify-center overflow-hidden">
                      {user.profile_picture ? (
                        <img 
                          src={getProfilePhotoUrl(user.profile_picture)} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<UserCircle className="w-7 h-7 text-[#7A9D82]" />';
                          }}
                        />
                      ) : (
                        <UserCircle className="w-7 h-7 text-[#7A9D82]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#2F3E36] flex items-center gap-1">
                        {user.username}
                        {user.role === "admin" && <Crown className="w-4 h-4 text-amber-500" />}
                      </h3>
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                        {user.role === "admin" ? "Administrator" : "User"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.full_name && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{user.full_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(user)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Detail
                    </button>
                    {user.id !== currentAdminId && (
                      <button
                        onClick={() => handleDelete(user.id, user.username, user.role)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#2F3E36]">Tidak ada user ditemukan</h3>
            <p className="text-gray-400 text-sm mt-1">Coba ubah kata kunci pencarian</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`px-6 py-4 ${selectedUser.role === "admin" ? "bg-linear-to-r from-amber-600 to-orange-600" : "bg-linear-to-r from-emerald-600 to-teal-600"} text-white rounded-t-2xl`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Detail User</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-white text-2xl hover:opacity-80">×</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center -mt-10 mb-2">
                <div className="w-20 h-20 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
                  {selectedUser.profile_picture ? (
                    <img 
                      src={getProfilePhotoUrl(selectedUser.profile_picture)} 
                      alt={selectedUser.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-10 h-10 text-[#7A9D82]" />
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">ID User</span>
                  <span className="font-medium text-sm">#{selectedUser.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Username</span>
                  <span className="font-medium text-sm">{selectedUser.username}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Nama Lengkap</span>
                  <span className="font-medium text-sm">{selectedUser.full_name || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="font-medium text-sm break-all">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Nomor HP</span>
                  <span className="font-medium text-sm">{selectedUser.phone || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Alamat</span>
                  <span className="font-medium text-sm break-all">{selectedUser.address || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Role</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role === "admin" ? "Administrator" : "User"}
                  </span>
                </div>
                {selectedUser.created_at && (
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500 text-sm">Bergabung Sejak</span>
                    <span className="font-medium text-sm">{new Date(selectedUser.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Tutup
              </button>
              {selectedUser.id !== currentAdminId && (
                <button 
                  onClick={() => { 
                    setShowDetailModal(false); 
                    handleDelete(selectedUser.id, selectedUser.username, selectedUser.role); 
                  }} 
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
