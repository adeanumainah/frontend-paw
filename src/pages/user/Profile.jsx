import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { getProfile, updateProfile } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Edit2,
  Save,
  X,
  UserCircle,
  PawPrint,
  CalendarDays,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function Profile() {
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    phone: "",
    address: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const getProfilePhotoUrl = (photo) => {
    if (!photo) return null;
    return `http://localhost:3000/uploads/profiles/${photo}`;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data);
      setFormData({
        username: response.data.username || "",
        full_name: response.data.full_name || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
      });
      if (response.data.profile_picture) {
        setPreviewUrl(getProfilePhotoUrl(response.data.profile_picture));
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  // Validasi untuk setiap field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Username tidak boleh kosong";
        } else if (value.length < 3) {
          error = "Username minimal 3 karakter";
        } else if (value.length > 30) {
          error = "Username maksimal 30 karakter";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error =
            "Username hanya boleh mengandung huruf, angka, dan underscore";
        }
        break;

      case "full_name":
        if (value && value.length > 100) {
          error = "Nama lengkap maksimal 100 karakter";
        } else if (value && !/^[a-zA-Z\s\.,'-]+$/.test(value)) {
          error =
            "Nama lengkap hanya boleh mengandung huruf, spasi, titik, koma, apostrof, dan tanda hubung";
        }
        break;

      case "phone":
        if (value) {
          // Hanya angka yang diperbolehkan
          if (!/^\d+$/.test(value)) {
            error = "Nomor HP hanya boleh berisi angka";
          } else if (value.length < 10) {
            error = "Nomor HP minimal 10 digit";
          } else if (value.length > 13) {
            error = "Nomor HP maksimal 13 digit";
          } else if (!/^08/.test(value)) {
            error = "Nomor HP harus diawali dengan 08";
          }
        }
        break;

      case "address":
        if (value && value.length > 500) {
          error = "Alamat maksimal 500 karakter";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Khusus untuk phone: hanya izinkan angka
    if (name === "phone") {
      processedValue = value.replace(/[^0-9]/g, "");
      if (processedValue.length > 13) {
        processedValue = processedValue.slice(0, 13);
      }
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Validasi realtime
    const error = validateField(name, processedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto maksimal 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ["username", "full_name", "phone", "address"];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sebelum submit
    if (!validateForm()) {
      toast.warning("Mohon perbaiki data yang masih bermasalah");
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("full_name", formData.full_name);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      if (profilePicture) {
        submitData.append("profile_picture", profilePicture);
      }

      const response = await updateProfile(submitData);
      setProfile(response.data);

      if (response.data.profile_picture) {
        setPreviewUrl(getProfilePhotoUrl(response.data.profile_picture));
      }

      setEditing(false);
      setErrors({});
      toast.success("Profil berhasil diupdate!");
    } catch (error) {
      console.error("Error detail:", error);
      toast.error(error.response?.data?.message || "Gagal mengupdate profil");
    } finally {
      setUploading(false);
    }
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

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: profile.username || "",
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setProfilePicture(null);
    if (profile.profile_picture) {
      setPreviewUrl(getProfilePhotoUrl(profile.profile_picture));
    } else {
      setPreviewUrl("");
    }
    setErrors({});
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#7A9D82]/20 border-t-[#7A9D82] rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div
        className={`min-h-screen py-8 transition-colors duration-300 ${
          darkMode ? "bg-slate-900" : "bg-[#F9F6F0]"
        }`}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-[#7A9D82]/10 p-3 rounded-2xl mb-3">
              <UserCircle className="w-8 h-8 text-[#7A9D82]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2F3E36] mb-2">
              Profil Saya
            </h1>
            <p className="text-[#2F3E36]/60">Kelola informasi akun Anda</p>
          </div>

          {/* Profile Card */}
          <div
            className={`rounded-2xl overflow-hidden transition-all duration-300 ${
              darkMode
                ? "bg-slate-800 border border-slate-700 shadow-xl"
                : "bg-white border border-gray-100 shadow-sm"
            }`}
          >
            {/* Cover/Header */}
            <div className="relative h-32 bg-linear-to-r from-[#7A9D82] to-[#8AAD92]">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent"></div>
            </div>

            {/* Avatar Section */}
            <div className="relative px-6">
              <div className="absolute -top-16 left-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-xl bg-linear-to-br from-[#7A9D82]/20 to-[#8AAD92]/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : profile?.profile_picture ? (
                      <img
                        src={getProfilePhotoUrl(profile.profile_picture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PawPrint className="w-10 h-10 text-[#7A9D82]" />
                    )}
                  </div>
                  {editing && (
                    <label className="absolute -bottom-1 -right-1 bg-[#7A9D82] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#E2A76F] transition-all shadow-md">
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="text-right pt-4 pb-4 ml-auto">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7A9D82]/10 text-[#7A9D82] font-medium hover:bg-[#7A9D82] hover:text-white transition-all duration-300"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        uploading ||
                        Object.keys(errors).some((key) => errors[key])
                      }
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7A9D82] text-white font-medium hover:bg-[#E2A76F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Simpan
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 pt-4">
              <div className="space-y-5">
                {/* Email - readonly */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </label>
                  <p
                    className={`font-medium px-4 py-2.5 rounded-xl ${
                      darkMode
                        ? "bg-slate-700 text-white"
                        : "bg-gray-50 text-[#2F3E36]"
                    }`}
                  >
                    {profile.email}
                  </p>
                </div>

                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                    <User className="w-3.5 h-3.5" />
                    Username <span className="text-red-500">*</span>
                  </label>
                  {editing ? (
                    <div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none ${
                          errors.username
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20"
                        }`}
                        placeholder="Masukkan username"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.username}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Minimal 3 karakter, hanya huruf, angka, dan underscore
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`font-medium px-4 py-2.5 rounded-xl ${
                        darkMode
                          ? "bg-slate-700 text-white"
                          : "bg-gray-50 text-[#2F3E36]"
                      }`}
                    >
                      {profile.username}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                      <User className="w-3.5 h-3.5" />
                      Nama Lengkap
                    </label>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none ${
                            errors.full_name
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20"
                          }`}
                          placeholder="Masukkan nama lengkap"
                        />
                        {errors.full_name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.full_name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p
                        className={`font-medium px-4 py-2.5 rounded-xl ${
                          darkMode
                            ? "bg-slate-700 text-white"
                            : "bg-gray-50 text-[#2F3E36]"
                        }`}
                      >
                        {profile.full_name || (
                          <span className="text-gray-400">Belum diisi</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                      <Phone className="w-3.5 h-3.5" />
                      Nomor HP
                    </label>
                    {editing ? (
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="08123456789"
                          maxLength={13}
                          className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none ${
                            errors.phone
                              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                              : "border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.phone}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Hanya angka, diawali 08, 10-13 digit
                        </p>
                      </div>
                    ) : (
                      <p
                        className={`font-medium px-4 py-2.5 rounded-xl ${
                          darkMode
                            ? "bg-slate-700 text-white"
                            : "bg-gray-50 text-[#2F3E36]"
                        }`}
                      >
                        {profile.phone || (
                          <span className="text-gray-400">Belum diisi</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Alamat
                  </label>
                  {editing ? (
                    <div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Masukkan alamat lengkap Anda"
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none resize-none ${
                          errors.address
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.address}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p
                      className={`font-medium px-4 py-2.5 rounded-xl ${
                        darkMode
                          ? "bg-slate-700 text-white"
                          : "bg-gray-50 text-[#2F3E36]"
                      }`}
                    >
                      {profile.address || (
                        <span className="text-gray-400">Belum diisi</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Member Since */}
                <div
                  className={`pt-2 ${
                    darkMode
                      ? "border-t border-slate-700"
                      : "border-t border-gray-100"
                  }`}
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2F3E36]/60 mb-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Bergabung Sejak
                  </label>
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
                      darkMode
                        ? "bg-slate-700 text-white"
                        : "bg-gray-50 text-[#2F3E36]"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-[#7A9D82]" />
                    <span>{formatDate(profile.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
