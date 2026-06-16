// Login.js - Versi Lengkap dengan Validasi
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Eye, EyeOff, PawPrint, LogIn } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validasi email
    if (!email) {
      newErrors.email = "Email wajib diisi!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid!";
    }
    
    // Validasi password
    if (!password) {
      newErrors.password = "Password wajib diisi!";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await loginUser(email, password);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      toast.success(`Selamat datang kembali, ${response.user.username}!`);
      
      setTimeout(() => {
        if (response.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="flex justify-center mb-4">
              <div className="bg-[#7A9D82] p-4 rounded-2xl shadow-lg">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#2F3E36] mb-2">
              PawCare
            </h1>
            <p className="text-[#7A9D82] font-medium">Kelola kesehatan hewan peliharaan Anda</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/40 animate-fadeInUp">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-[#2F3E36] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7A9D82]/20 ${
                      errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#7A9D82]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 animate-shake">{errors.email}</p>
                )}
              </div>

              {/* Password Field with Eye Icon */}
              <div>
                <label className="block text-sm font-semibold text-[#2F3E36] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9D82]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 animate-shake">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7A9D82] hover:bg-[#E2A76F] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-[#2F3E36]/60">
                Belum punya akun?{" "}
                <Link to="/register" className="text-[#7A9D82] font-semibold hover:text-[#E2A76F] transition-colors hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}

export default Login;
