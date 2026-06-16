# 🐾 PawCare

PawCare adalah aplikasi manajemen kesehatan hewan peliharaan berbasis web yang dikembangkan menggunakan **React.js**, **Express.js**, dan **PostgreSQL**. Aplikasi ini dirancang untuk membantu pemilik hewan dalam mengelola data hewan peliharaan, vaksinasi, rekam medis, jadwal perawatan, serta memperoleh informasi edukatif terkait kesehatan hewan.

Selain fitur pengguna (User), sistem juga menyediakan panel administrator (Admin) untuk mengelola seluruh data yang terdapat dalam aplikasi.

---

# 📌 Tujuan Proyek

PawCare dikembangkan sebagai sarana pembelajaran dan implementasi pengembangan aplikasi Full Stack Web dengan konsep:

* REST API
* JWT Authentication
* Role Based Access Control (RBAC)
* CRUD Management System
* Responsive Web Design
* Modern UI/UX
* PostgreSQL Database Management

---

# 🛠️ Teknologi yang Digunakan

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* React Toastify
* SweetAlert2
* Lucide React Icons
* Context API
* Vite

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (File Upload)
* PostgreSQL
* Middleware Validation
* REST API

## Database

* PostgreSQL

---

# 🔐 Authentication & Authorization

Sistem keamanan menggunakan JWT (JSON Web Token) dengan implementasi:

* Login
* Register
* Logout
* Protected Routes
* Role Based Access Control (RBAC)
* Session Management
* Authorization Middleware

### Role User

User dapat:

* Mengelola data hewan peliharaan
* Mengelola vaksinasi
* Mengelola rekam medis
* Mengelola jadwal perawatan
* Membaca artikel
* Membaca tips kesehatan
* Melihat rekomendasi makanan
* Mengelola profil pribadi

### Role Admin

Admin dapat:

* Mengelola seluruh data sistem
* Mengelola user
* Mengelola artikel
* Mengelola tips kesehatan
* Mengelola rekomendasi makanan
* Mengelola data vaksinasi
* Mengelola rekam medis
* Mengelola jadwal
* Melihat statistik aplikasi

---

# 🚀 Fitur Utama

## 👤 User Features

### Authentication

* Login
* Register
* Logout
* JWT Authentication
* Protected Route

### Dashboard

* Statistik data pengguna
* Total Pets
* Total Vaccinations
* Total Medical Records
* Upcoming Schedules
* Recent Pets

### Pets Management

* Create Pet
* View Pet
* Update Pet
* Delete Pet
* Upload Foto Hewan
* Search
* Filter
* Pagination

### Vaccinations Management

* CRUD Vaccination
* Upcoming Vaccination Reminder
* Validasi Tanggal Vaksinasi
* Countdown Jadwal Vaksin

### Medical Records Management

* CRUD Medical Records
* Search
* Pagination
* Statistik Rekam Medis

### Schedule Management

* CRUD Schedule
* Status Management
* Upcoming Schedule Reminder
* Filter Status
* Mark as Completed

### Articles

* View Articles
* Search Articles

### Health Tips

* View Health Tips
* Featured Health Tips

### Food Recommendations

* View Food Recommendations
* Filter Berdasarkan Jenis Hewan

### Profile Management

* Edit Profile
* Upload Profile Picture
* Validasi Data Pengguna

---

## 🛡️ Admin Features

### Admin Dashboard

* Total Users
* Total Pets
* Total Vaccinations
* Total Medical Records
* Total Schedules
* Total Articles
* Total Health Tips
* Total Food Recommendations

### User Management

* View Users
* Manage User Data

### Pets Management

* View Pet Details

### Vaccinations Management

* Create
* Read
* Update
* Delete

### Medical Records Management

* Create
* Read
* Update
* Delete

### Schedule Management

* Create
* Read
* Update
* Delete

### Articles Management

* Create
* Read
* Update
* Delete

### Health Tips Management

* Create
* Read
* Update
* Delete

### Food Recommendations Management

* Create
* Read
* Update
* Delete

---

# 🎨 UI/UX Features

## Responsive Design

Aplikasi dirancang agar dapat digunakan pada:

* Desktop
* Tablet
* Mobile Device

## Dark Mode

Fitur dark mode menggunakan:

* React Context API
* Local Storage Persistence
* Dynamic Theme Switching

## Modern User Experience

* Toast Notification
* SweetAlert Confirmation
* Loading State
* Empty State
* Responsive Navigation
* Fixed Sidebar
* Smooth Animation
* Hover Effects
* Card-Based Layout

---

# 🎨 Color Palette

| Color           | Hex     |
| --------------- | ------- |
| Warm Cream      | #F9F6F0 |
| Sage Green      | #7A9D82 |
| Dark Slate      | #2F3E36 |
| Soft Terracotta | #E2A76F |

---

# 🔍 Search, Filter & Pagination

Fitur pencarian dan pengelolaan data diterapkan pada beberapa modul:

* Pets
* Vaccinations
* Medical Records
* Schedules
* Articles
* Food Recommendations

---

# 📂 File Upload

Implementasi upload file menggunakan Multer untuk:

* Foto Profil User
* Foto Hewan Peliharaan

---

# 🧪 Validation & Error Handling

Validasi yang diterapkan:

### User Validation

* Email Validation
* Password Validation
* Phone Number Validation
* Username Validation

### Vaccination Validation

* Next Vaccine Date harus lebih besar dari Vaccine Date

### Form Validation

* Required Fields
* Format Validation
* Error Message Handling

### Error Handling

* API Error Handling
* JWT Error Handling
* Validation Error Handling
* Upload Error Handling

---

# 🐞 Bug Fixes & Improvements

Selama proses pengembangan, beberapa perbaikan yang berhasil dilakukan antara lain:

* Fix JWT Authentication Error
* Fix Axios Authorization Header
* Fix React Router Navigation
* Fix Upload File Error
* Fix PostgreSQL Query Error
* Fix Timezone Issue pada tanggal vaksinasi dan rekam medis
* Fix Sidebar Layout
* Fix Responsive Navbar
* Fix Dark Mode State Persistence
* Fix Pagination Display
* Fix Admin Self Delete Protection

---

# 📈 Pengembangan dan Kontribusi

Selama proses pengembangan proyek, dilakukan berbagai aktivitas seperti:

## Perancangan Sistem

* Struktur Frontend dan Backend
* Database Design
* API Design
* Role Architecture

## Backend Development

* REST API Development
* Middleware Development
* Authentication System
* Authorization System
* File Upload System
* Validation Layer

## Frontend Development

* Dashboard Development
* CRUD Interface
* Theme Management
* Routing System
* Responsive Design

## Debugging & Optimization

* API Debugging
* UI Fixes
* Performance Improvement
* User Experience Enhancement

---

# 📚 Pembelajaran yang Diperoleh

Melalui pengembangan proyek PawCare, diperoleh pengalaman dalam:

* Full Stack Web Development
* React.js Development
* Express.js Development
* PostgreSQL Database Management
* REST API Development
* JWT Authentication
* Role Based Access Control
* File Upload Management
* Responsive Web Design
* UI/UX Design
* Debugging dan Problem Solving
* Software Architecture Design

---

# 📌 Status Proyek

✅ Authentication & Authorization

✅ User Dashboard

✅ Admin Dashboard

✅ Pets Management

✅ Vaccinations Management

✅ Medical Records Management

✅ Schedule Management

✅ Articles Management

✅ Health Tips Management

✅ Food Recommendations Management

✅ Profile Management

✅ File Upload

✅ Dark Mode

✅ Search, Filter & Pagination

✅ Responsive Design

---

# 👨‍💻 Developer Notes

PawCare dikembangkan sebagai proyek pembelajaran Full Stack Web Development dengan fokus pada implementasi sistem manajemen data yang aman, responsif, dan mudah digunakan.

Proyek ini menerapkan praktik pengembangan modern seperti JWT Authentication, Role Based Access Control (RBAC), REST API Architecture, serta desain antarmuka yang responsif untuk meningkatkan pengalaman pengguna.

---
ERD

<img width="844" height="832" alt="erd_pawcare" src="https://github.com/user-attachments/assets/1b1d060e-a78c-4c05-ac78-68f03d8d5d52" />

