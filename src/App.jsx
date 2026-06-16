import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext"; 

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Pets from "./pages/user/Pets";
import Users from "./pages/admin/Users";
import AdminPets from "./pages/admin/AdminPets";
import AdminVaccinations from "./pages/admin/AdminVaccinations";
import AdminMedicalRecords from "./pages/admin/AdminMedicalRecords";
import AdminSchedules from "./pages/admin/AdminSchedules";
import Vaccinations from "./pages/user/Vaccinations";
import MedicalRecords from "./pages/user/MedicalRecords";
import Schedules from "./pages/user/Schedule";
import Profile from "./pages/user/Profile";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminHealthTips from "./pages/admin/AdminHealthTips";
import AdminFoodRecommendations from "./pages/admin/AdminFoodRecommendations";

function App() {
  const { darkMode } = useTheme(); // Panggil state darkMode di sini

  return (
 <div className={`${darkMode ? "dark" : ""}`}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute role="user"><Pets /></ProtectedRoute>} />
          <Route path="/vaccinations" element={<ProtectedRoute role="user"><Vaccinations /></ProtectedRoute>} />
          <Route path="/medical-records" element={<ProtectedRoute role="user"><MedicalRecords /></ProtectedRoute>} />
          <Route path="/schedules" element={<ProtectedRoute role="user"><Schedules /></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/pets" element={<AdminPets />} />
            <Route path="/admin/vaccinations" element={<AdminVaccinations />} />
            <Route path="/admin/medical-records" element={<AdminMedicalRecords />} />
            <Route path="/admin/schedules" element={<AdminSchedules />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/health-tips" element={<AdminHealthTips />} />
            <Route path="/admin/foods" element={<AdminFoodRecommendations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


