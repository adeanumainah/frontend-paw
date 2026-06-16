// Register.js - Versi Lengkap dengan Validasi
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, PawPrint, UserPlus } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    address: "",
  });

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^08[0-9]{8,11}$/; // 08 diikuti 8-11 digit angka
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validasi username
    if (!formData.username) {
      newErrors.username = "Username wajib diisi!";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter!";
    }
    
    // Validasi email
    if (!formData.email) {
      newErrors.email = "Email wajib diisi!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid!";
    }
    
    // Validasi password
    if (!formData.password) {
      newErrors.password = "Password wajib diisi!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter!";
    }
    
    // Validasi confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama!";
    }
    
    // Validasi phone (jika diisi)
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Nomor HP harus diawali 08 dan terdiri dari 10-13 angka!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    
    // Khusus untuk phone, filter hanya angka
    if (name === "phone") {
      value = value.replace(/[^0-9]/g, "");
      if (value.length > 13) value = value.slice(0, 13);
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await registerUser(registerData);
      toast.success("Register berhasil! Silakan login.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="flex justify-center mb-4">
              <div className="bg-[#7A9D82] p-4 rounded-2xl shadow-lg">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2F3E36] mb-2">
              Daftar Akun Baru
            </h1>
            <p className="text-[#7A9D82] font-medium">Bergabunglah untuk mengelola hewan peliharaan Anda</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/40 animate-fadeInUp">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Informasi Akun */}
              <div className="border-b border-gray-200 pb-4 mb-2">
                <h2 className="text-lg font-semibold text-[#2F3E36] mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#7A9D82]" />
                  Informasi Akun
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Username *"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                          errors.username ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                        }`}
                      />
                    </div>
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                          errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  {/* Password */}
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password * (min 6 karakter)"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                          errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9D82] hover:text-[#E2A76F] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Konfirmasi Password *"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                          errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A9D82] hover:text-[#E2A76F] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Informasi Pribadi */}
              <div className="pb-2">
                <h2 className="text-lg font-semibold text-[#2F3E36] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#7A9D82]" />
                  Informasi Pribadi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Nama Lengkap"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all duration-200 focus:outline-none"
                  />
                  
                  {/* Phone dengan validasi */}
                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Nomor HP (08xxxxxxxxxx)"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                          errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 w-5 h-5 text-[#7A9D82]" />
                      <textarea
                        name="address"
                        placeholder="Alamat Lengkap"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#7A9D82] focus:ring-2 focus:ring-[#7A9D82]/20 transition-all duration-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7A9D82] hover:bg-[#E2A76F] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Daftar Sekarang
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-[#2F3E36]/60">
                Sudah punya akun?{" "}
                <Link to="/" className="text-[#7A9D82] font-semibold hover:text-[#E2A76F] transition-colors hover:underline">
                  Login di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </>
  );
}

export default Register;
