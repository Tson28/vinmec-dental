# 🦷 VinaMec — Dental Care AI System

**Hệ thống quản lý phòng khám nha khoa thông minh tích hợp AI**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Tính năng](#-tính-năng) · [Cài đặt](#-cài-đặt-nhanh) · [API Reference](#-api-reference) · [Phân quyền](#-phân-quyền-rbac) · [Deploy](#-deploy)

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tài khoản Demo](#-tài-khoản-demo)
- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Reference](#-api-reference)
- [Phân quyền RBAC](#-phân-quyền-rbac)
- [AI Chatbot](#-ai-chatbot)
- [Upload ảnh](#-upload-ảnh)
- [Video Call](#-video-call)
- [Chạy test](#-chạy-test)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)

---
## 🌟 Giới thiệu

**VinaMec** là hệ thống quản lý phòng khám nha khoa full-stack tích hợp AI, xây dựng trên kiến trúc hiện đại. Hệ thống hỗ trợ **3 vai trò** người dùng với giao diện và quyền hạn riêng biệt, tích hợp chatbot AI, phân tích ảnh X-quang, video tư vấn trực tuyến và theo dõi sức khỏe răng miệng.

```
┌─────────────────────────────────────────────────────────┐
│                    VinaMec System                        │
│                                                         │
│   👨‍💼 Admin        👨‍⚕️ Doctor       🧑‍🤝‍🧑 Patient         │
│   ─────────────  ─────────────  ─────────────          │
│   Quản lý toàn   Xem bệnh nhân  Đặt lịch hẹn           │
│   hệ thống       Hồ sơ bệnh án  Xem kết quả            │
│   Báo cáo KPIs   AI Chatbot     AI Chatbot              │
│   Dịch vụ        X-Ray viewer   Điểm sức khỏe          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Tài khoản Demo

Sau khi chạy `npm run seed`:

| Vai trò | Email | Mật khẩu | URL |
|---------|-------|----------|-----|
| 🔴 **Admin** | `admin@vinamec.vn` | `admin123` | `/admin` |
| 🔵 **Doctor** | `doctor@vinamec.vn` | `doctor123` | `/doctor` |
| 🟢 **Patient** | `patient@vinamec.vn` | `patient123` | `/patient` |
| 💬 **Public** | *(không cần login)* | — | `/chat/public` |

---

## ✨ Tính năng

### 👨‍💼 Admin Dashboard
- Tổng quan KPI: người dùng, lịch hẹn, doanh thu, điểm nha khoa trung bình
- CRUD: Người dùng, Bác sĩ, Dịch vụ (tên, giá, thời lượng, danh mục)
- Biểu đồ xu hướng lịch hẹn theo tháng, top dịch vụ phổ biến
- Feed hoạt động hệ thống real-time
- Thông tin server, database, môi trường

### 👨‍⚕️ Doctor Dashboard
- Danh sách bệnh nhân và hồ sơ
- Quản lý lịch hẹn (xác nhận, hoàn thành, huỷ)
- Tạo và cập nhật hồ sơ bệnh án (chẩn đoán, điều trị, đơn thuốc)
- Xem toàn bộ ảnh X-quang và ảnh răng của bệnh nhân
- AI Chatbot lâm sàng riêng tư (có context y tế cá nhân)
- Video call WebRTC với bệnh nhân
- Ghi chú giọng nói (Voice transcription)
- Phân tích ảnh AI (AI Prediction)

### 🧑‍🤝‍🧑 Patient Dashboard
- Xem và cập nhật hồ sơ cá nhân
- Đặt lịch hẹn với bác sĩ (chọn dịch vụ, bác sĩ, ngày giờ)
- Xem hồ sơ bệnh án của mình
- Upload và xem ảnh răng của mình
- Điểm sức khỏe nha khoa với biểu đồ Line + Radar
- AI Chatbot tư vấn cá nhân hoá
- Video call với bác sĩ

### 🤖 AI & Automation
- Chatbot công khai và riêng tư (OpenAI hoặc rule-based fallback)
- Phân tích ảnh X-quang tự động
- Tính điểm sức khỏe từ hồ sơ bệnh án
- Email nhắc nhở lịch hẹn hàng ngày lúc 08:00 (cron job)

### 🔐 Bảo mật
- JWT Authentication với tự động refresh
- RBAC 3 cấp với ownership validation
- Rate limiting: global, auth, chat, upload riêng biệt
- NoSQL injection prevention
- XSS sanitization
- Helmet security headers

---

## 🛠 Tech Stack

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Node.js | 18+ | Runtime |
| Express | 4.18 | Web framework |
| MongoDB + Mongoose | 8.x | Database + ODM |
| jsonwebtoken | 9.0 | JWT Authentication |
| bcryptjs | 2.4 | Password hashing |
| Multer | 1.4 | File upload |
| Joi | 17.12 | Input validation |
| Helmet | 7.1 | Security headers |
| express-rate-limit | 7.1 | Rate limiting |
| uuid | 9.0 | Session ID generation |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18.2 | UI Framework |
| TypeScript | 5.2 | Type safety |
| Vite | 5.1 | Build tool |
| TailwindCSS | 3.4 | Styling |
| React Router DOM | 6.22 | Client routing |
| Axios | 1.6 | HTTP client + interceptors |
| Chart.js + react-chartjs-2 | 4.4 | Biểu đồ |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + TS)                       │
│                                                                      │
│  AuthContext ──► ProtectedRoute ──► Pages (Admin/Doctor/Patient)    │
│       │                                    │                         │
│  ToastContext                        DashboardLayout                 │
│                                      (Sidebar + Navbar)              │
│                                                                      │
│  services/api.ts  ←─── Axios interceptor (JWT attach + 401 handle) │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ HTTP REST
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Express)                           │
│                                                                      │
│  Helmet │ CORS │ Rate Limiter │ Sanitize │ RequestLogger            │
│                         │                                            │
│              Routes (14 nhóm)                                        │
│    auth / admin / users / patients / doctors / appointments          │
│    records / services / images / scores / chat / predict / voice    │
│                         │                                            │
│         auth() ──► authorize(roles[]) ──► validate() (Joi)         │
│                         │                                            │
│              Controllers (13 controllers)                            │
│                         │                                            │
│    Services: aiService │ appointmentService │ scoreService           │
│              emailService                                            │
│                         │                                            │
│    Models: User │ Patient │ Doctor │ Appointment │ MedicalRecord    │
│            Service │ ImageAnalysis │ DentalScore │ ChatHistory      │
│                         │                                            │
│                      MongoDB                                         │
│                                                                      │
│  Background Jobs: reminderJob (daily @ 08:00)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Cài đặt nhanh

### Yêu cầu
- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local hoặc Atlas)
- **npm** >= 9.x

### Backend

```bash
cd vinamec-backend
npm install
cp .env.example .env
# Chỉnh sửa .env (MONGODB_URI, JWT_SECRET)
npm run seed      # Tạo dữ liệu mẫu
npm run dev       # http://localhost:5000
```

### Frontend

```bash
cd vinamec-dental
npm install
npm run dev       # http://localhost:5173
```

---

## ⚙️ Cấu hình môi trường

### `vinamec-backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vinamec_dental

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# AI Chatbot (tuỳ chọn — để trống dùng rule-based miễn phí)
OPENAI_API_KEY=sk-your-openai-key

# Email (tuỳ chọn)
EMAIL_FROM=noreply@vinamec.vn

# CORS
FRONTEND_URL=http://localhost:5173
```

### `vinamec-dental/.env` (tuỳ chọn)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=VinaMec Dental Care
```

---

## 📁 Cấu trúc dự án

```
vinamec-backend/
├── src/
│   ├── config/
│   │   ├── cors.js             ← CORS origins + options
│   │   ├── db.js               ← MongoDB connection
│   │   ├── multer.js           ← File upload config (images/xrays/scans)
│   │   ├── rateLimit.js        ← Rate limiter presets (global/auth/chat/upload)
│   │   └── swagger.js          ← OpenAPI 3.0 spec → GET /api/docs
│   ├── controllers/            ← 13 controllers
│   │   ├── adminController.js      Dashboard KPIs, stats, activity feed
│   │   ├── appointmentController.js CRUD + slots + cancel + stats
│   │   ├── authController.js       Register, login, me, change-password
│   │   ├── chatController.js       Public chat, private chat, history
│   │   ├── doctorController.js     CRUD + my-profile + my-patients
│   │   ├── imageController.js      Upload + gallery + AI analyze
│   │   ├── patientController.js    CRUD + my-profile
│   │   ├── predictionController.js AI image analysis (single + batch)
│   │   ├── recordController.js     CRUD medical records
│   │   ├── scoreController.js      Dental score CRUD
│   │   ├── serviceController.js    CRUD dental services
│   │   ├── userController.js       Admin user management
│   │   └── voiceController.js      Transcribe, note, TTS
│   ├── jobs/
│   │   ├── index.js            ← startJobs() / stopJobs() lifecycle
│   │   └── reminderJob.js      ← Daily 08:00 reminder email cron
│   ├── middleware/
│   │   ├── auth.js             ← auth() verify JWT + authorize(roles[])
│   │   ├── errorHandler.js     ← Global error handler + 404
│   │   ├── ownershipGuard.js   ← Patient data isolation middleware
│   │   ├── rateLimiter.js      ← Re-exports rate limiters for routes
│   │   ├── requestLogger.js    ← Per-request structured logging
│   │   ├── sanitize.js         ← NoSQL injection + XSS prevention
│   │   ├── upload.js           ← Multer error wrapper
│   │   └── validate.js         ← Joi schema validation middleware
│   ├── models/                 ← 9 Mongoose models
│   │   ├── Appointment.js      date, time, status, fee, doctor, patient
│   │   ├── ChatHistory.js      messages[], sessionId, type (public/private)
│   │   ├── DentalScore.js      overall, gumHealth, toothDecay, alignment, cleanliness, history[]
│   │   ├── Doctor.js           specialization, licenseNumber, workingHours, rating
│   │   ├── ImageAnalysis.js    url, type, aiAnalysis, patient, uploadedBy
│   │   ├── MedicalRecord.js    diagnosis, treatment, prescription, teeth[], vitalSigns
│   │   ├── Patient.js          bloodType, allergies, emergencyContact, insuranceInfo
│   │   ├── Service.js          category, duration, price, currency
│   │   └── User.js             name, email, password(hashed), role, isActive
│   ├── routes/                 ← 14 route groups
│   │   ├── index.js            ← Central router + /health
│   │   ├── adminRoutes.js      /admin/*
│   │   ├── appointmentRoutes.js /appointments/*
│   │   ├── authRoutes.js       /auth/*
│   │   ├── chatRoutes.js       /chat/*
│   │   ├── doctorRoutes.js     /doctors/*
│   │   ├── imageRoutes.js      /images/*
│   │   ├── patientRoutes.js    /patients/*
│   │   ├── predictionRoutes.js /predict/*
│   │   ├── recordRoutes.js     /records/*
│   │   ├── scoreRoutes.js      /scores/*
│   │   ├── serviceRoutes.js    /services/*
│   │   ├── userRoutes.js       /users/*
│   │   └── voiceRoutes.js      /voice/*
│   ├── services/
│   │   ├── aiService.js        ← OpenAI GPT + rule-based fallback
│   │   ├── appointmentService.js ← Business logic: booking, conflict, reminders
│   │   ├── emailService.js     ← Email templates (confirm/cancel/reminder/welcome)
│   │   └── scoreService.js     ← Score calculation + heuristics from records
│   ├── tests/
│   │   ├── auth.test.js        ← Auth API tests (requires running server)
│   │   ├── api.test.js         ← Integration tests all endpoints (requires server + seed)
│   │   └── services.test.js    ← 66 unit tests (no DB required)
│   ├── utils/
│   │   ├── asyncHandler.js     ← Wraps async handlers, forwards errors to next()
│   │   ├── constants.js        ← ROLES, STATUSES, HTTP_STATUS, RATE_LIMITS, ...
│   │   ├── dateHelpers.js      ← today(), addDays(), generateTimeSlots(), isWeekend(), ...
│   │   ├── helpers.js          ← calculateOverallScore(), getScoreLabel(), pick(), omit(), ...
│   │   ├── jwt.js              ← generateToken(), verifyToken()
│   │   ├── logger.js           ← Structured console + file logger with levels
│   │   ├── pagination.js       ← getPagination(), buildSort()
│   │   ├── response.js         ← sendSuccess(), sendError(), sendPaginated()
│   │   ├── seed.js             ← Database seeder (admin + 3 doctors + 3 patients + services)
│   │   └── validators.js       ← Shared Joi schemas: objectId, dateString, registerSchema, ...
│   └── server.js               ← Express app entry + middleware stack + startup
├── .env / .env.example
├── nodemon.json
└── package.json

vinamec-dental/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatInterface.tsx   ← Reusable chat UI (bubble, typing, suggestions)
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx ← Sidebar + Navbar wrapper
│   │   │   ├── ErrorBoundary.tsx   ← React error boundary
│   │   │   ├── Navbar.tsx          ← Top bar with notifications + user
│   │   │   ├── PageHeader.tsx      ← Title + breadcrumb + actions
│   │   │   └── Sidebar.tsx         ← Role-based navigation + collapse
│   │   └── ui/
│   │       ├── Alert.tsx           ← info / success / warning / error
│   │       ├── Badge.tsx           ← Color badge with optional dot
│   │       ├── ConfirmDialog.tsx   ← Confirm/cancel modal
│   │       ├── EmptyState.tsx      ← Empty placeholder with CTA
│   │       ├── LoadingSpinner.tsx  ← Animated spinner
│   │       ├── Modal.tsx           ← Accessible modal (Esc to close)
│   │       ├── Pagination.tsx      ← Page navigation with ellipsis
│   │       ├── SearchInput.tsx     ← Input with clear button
│   │       ├── StatCard.tsx        ← KPI card with icon + value
│   │       ├── Table.tsx           ← Generic typed table with skeleton
│   │       └── Toaster.tsx         ← Toast notification renderer
│   ├── context/
│   │   ├── AuthContext.tsx         ← token, role, user, login(), logout()
│   │   └── ToastContext.tsx        ← Global toast: toast.success/error/info/warning
│   ├── hooks/
│   │   ├── useApi.ts               ← Data fetching with loading/error state
│   │   ├── useDebounce.ts          ← Debounce value hook
│   │   ├── useLocalStorage.ts      ← Type-safe localStorage hook
│   │   └── useToast.ts             ← Toast state management
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx  ← KPI cards + charts + activity
│   │   │   ├── AdminDoctors.tsx    ← Doctor CRUD with modal form
│   │   │   ├── AdminServices.tsx   ← Service CRUD with category stats
│   │   │   └── AdminUsers.tsx      ← User CRUD with role badge
│   │   ├── doctor/
│   │   │   ├── DoctorAppointments.tsx ← Filter by status + confirm/complete
│   │   │   ├── DoctorChat.tsx      ← Private AI chat with history
│   │   │   ├── DoctorDashboard.tsx ← Stats + upcoming appointments + quick actions
│   │   │   ├── DoctorImages.tsx    ← Gallery all patients + upload + lightbox
│   │   │   ├── DoctorPatients.tsx  ← Patient list table
│   │   │   └── DoctorRecords.tsx   ← Records + create new record form
│   │   ├── patient/
│   │   │   ├── PatientAppointment.tsx ← My appointments + booking form
│   │   │   ├── PatientChat.tsx     ← Private AI chat with context
│   │   │   ├── PatientDashboard.tsx ← Welcome + score + upcoming + quick actions + tips
│   │   │   ├── PatientDentalScore.tsx ← Score rings + progress bars + Line/Radar chart
│   │   │   ├── PatientImages.tsx   ← My images + upload panel + lightbox
│   │   │   ├── PatientProfile.tsx  ← View/edit profile + health summary
│   │   │   └── PatientRecords.tsx  ← My records card list + detail modal
│   │   ├── LoginPage.tsx           ← Login form + demo credentials
│   │   ├── PublicChatPage.tsx      ← Public chatbot (no auth)
│   │   ├── RegisterPage.tsx        ← Registration form
│   │   └── VideoCallPage.tsx       ← WebRTC video call UI
│   ├── routes/
│   │   └── ProtectedRoute.tsx      ← RBAC guard: redirect unauthorized users
│   ├── services/
│   │   └── api.ts                  ← Axios instance + JWT interceptor + all API calls
│   ├── types/
│   │   ├── index.ts                ← User, Appointment, MedicalRecord, DentalScore, ...
│   │   └── api.types.ts            ← LoginResponse, PaginatedResponse, ErrorResponse
│   └── utils/
│       ├── formatters.ts           ← formatDate, formatCurrency, initials, truncate, statusVariant
│       └── validators.ts           ← Form validation rules
├── public/
│   └── tooth.svg                   ← Favicon (gradient tooth SVG)
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

**Auth Header:** `Authorization: Bearer <jwt_token>`

**Swagger UI:** `http://localhost:5000/api/docs` *(dev only)*

---

### Format Response chuẩn

```json
// Thành công
{ "success": true, "message": "...", "data": { ... } }

// Danh sách có phân trang
{ "success": true, "data": [...], "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 } }

// Lỗi
{ "success": false, "message": "Mô tả lỗi" }
```

---

### 🔐 Auth

| Method | Endpoint | Auth | Mô tả |
|--------|----------|:----:|-------|
| `POST` | `/auth/register` | ❌ | Đăng ký tài khoản |
| `POST` | `/auth/login` | ❌ | Đăng nhập, nhận JWT |
| `GET`  | `/auth/me` | ✅ | Thông tin tài khoản |
| `PUT`  | `/auth/me` | ✅ | Cập nhật thông tin |
| `PUT`  | `/auth/change-password` | ✅ | Đổi mật khẩu |

```json
POST /auth/login
{ "email": "patient@vinamec.vn", "password": "patient123" }

Response:
{ "success": true, "data": { "token": "eyJ...", "role": "patient", "user": {...} } }
```

---

### 👨‍💼 Admin

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/admin/dashboard` | KPI tổng quan (users, appointments, revenue, score) |
| `GET` | `/admin/users/stats` | Thống kê người dùng theo role |
| `GET` | `/admin/appointments/stats` | Thống kê lịch hẹn theo khoảng ngày |
| `GET` | `/admin/activity` | Feed hoạt động gần đây |
| `GET` | `/admin/system` | Thông tin server + DB + môi trường |

---

### 👥 Users *(admin only)*

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET`    | `/users` | Danh sách (search, role filter, pagination) |
| `GET`    | `/users/:id` | Chi tiết |
| `POST`   | `/users` | Tạo mới |
| `PUT`    | `/users/:id` | Cập nhật |
| `DELETE` | `/users/:id` | Xoá |
| `PUT`    | `/users/:id/toggle-active` | Kích hoạt / vô hiệu hoá |

---

### 🧑‍🤝‍🧑 Patients

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`    | `/patients` | admin, doctor | Danh sách bệnh nhân |
| `GET`    | `/patients/me` | patient | Hồ sơ của mình |
| `GET`    | `/patients/:id` | admin, doctor, patient-self | Chi tiết |
| `PUT`    | `/patients/me` | patient | Cập nhật hồ sơ |
| `PUT`    | `/patients/:id` | admin | Cập nhật (admin) |
| `DELETE` | `/patients/:id` | admin | Vô hiệu hoá |

---

### 👨‍⚕️ Doctors

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`    | `/doctors` | all auth | Danh sách (search, specialization filter) |
| `GET`    | `/doctors/me` | doctor | Hồ sơ của mình |
| `GET`    | `/doctors/patients` | doctor | Bệnh nhân của tôi |
| `GET`    | `/doctors/:id` | all auth | Chi tiết |
| `POST`   | `/doctors` | admin | Tạo (tự động tạo user account) |
| `PUT`    | `/doctors/me` | doctor | Tự cập nhật |
| `PUT`    | `/doctors/:id` | admin | Cập nhật (admin) |
| `DELETE` | `/doctors/:id` | admin | Vô hiệu hoá |

---

### 📅 Appointments

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`  | `/appointments` | admin, doctor | Tất cả (filter: status, date, patientId) |
| `GET`  | `/appointments/me` | patient | Lịch hẹn của tôi |
| `GET`  | `/appointments/stats` | admin, doctor | Thống kê |
| `GET`  | `/appointments/slots?doctorId=&date=` | all auth | Slot trống |
| `GET`  | `/appointments/:id` | admin, doctor, patient-self | Chi tiết |
| `POST` | `/appointments` | patient | Đặt lịch (tự động check conflict) |
| `PUT`  | `/appointments/:id` | admin, doctor | Cập nhật status/notes/fee |
| `PUT`  | `/appointments/:id/cancel` | all (owner check) | Huỷ lịch |
| `DELETE` | `/appointments/:id` | admin | Xoá vĩnh viễn |

```json
POST /appointments
{
  "doctorId": "6...",
  "serviceId": "6...",
  "date": "2024-06-15",
  "time": "09:00",
  "notes": "Đau răng hàm trên"
}
```

---

### 📋 Medical Records

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`    | `/records` | admin, doctor | Tất cả (search, patientId filter) |
| `GET`    | `/records/me` | patient | Hồ sơ của tôi |
| `GET`    | `/records/:id` | admin, doctor, patient-self | Chi tiết |
| `POST`   | `/records` | admin, doctor | Tạo hồ sơ bệnh án |
| `PUT`    | `/records/:id` | admin, doctor-owner | Cập nhật |
| `DELETE` | `/records/:id` | admin | Xoá |

---

### 🦷 Services

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`    | `/services` | public | Danh sách (filter: category, search) |
| `GET`    | `/services/categories` | public | Các danh mục |
| `GET`    | `/services/:id` | public | Chi tiết |
| `POST`   | `/services` | admin | Tạo dịch vụ |
| `PUT`    | `/services/:id` | admin | Cập nhật |
| `DELETE` | `/services/:id` | admin | Ẩn (soft delete) |
| `DELETE` | `/services/:id/permanent` | admin | Xoá vĩnh viễn |

---

### 🖼️ Images

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`    | `/images` | admin, doctor | Tất cả ảnh |
| `GET`    | `/images/me` | patient | Ảnh của tôi |
| `GET`    | `/images/:id` | admin, doctor, patient-self | Chi tiết |
| `POST`   | `/images/upload` | all auth | Upload ảnh (multipart/form-data) |
| `DELETE` | `/images/:id` | admin, doctor, patient-self | Xoá ảnh |
| `POST`   | `/images/:id/analyze` | admin, doctor | Phân tích AI |
| `PUT`    | `/images/:id/notes` | admin, doctor | Ghi chú |

**Upload form fields:** `image` (file), `type` (xray/photo/scan), `description`, `patientId` *(bác sĩ bắt buộc điền)*

---

### ⭐ Dental Scores

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `GET`  | `/scores` | admin, doctor | Tất cả điểm |
| `GET`  | `/scores/me` | patient | Điểm của tôi |
| `GET`  | `/scores/patient/:id` | admin, doctor | Điểm theo bệnh nhân |
| `PUT`  | `/scores/patient/:id` | admin, doctor | Cập nhật điểm |

---

### 💬 Chat

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| `POST`   | `/chat/public` | ❌ no auth | Public chatbot |
| `POST`   | `/chat/private` | patient, doctor | Private chatbot (có context) |
| `GET`    | `/chat/history` | all auth | Lịch sử session |
| `GET`    | `/chat/history/:sessionId` | owner, admin | Tin nhắn theo session |
| `DELETE` | `/chat/history/:sessionId` | owner, admin | Xoá session |

```json
POST /chat/public
{ "message": "Nguyên nhân sâu răng?", "history": [], "sessionId": null }

Response:
{ "success": true, "data": { "reply": "Sâu răng xảy ra khi...", "sessionId": "uuid" } }
```

---

### 🔬 AI Prediction *(doctor, admin)*

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/predict/:imageId` | Phân tích 1 ảnh |
| `POST` | `/predict/batch` | Phân tích nhiều ảnh (max 10) |
| `GET`  | `/predict/results/:patientId` | Kết quả đã phân tích |

---

### 🎙️ Voice *(doctor only)*

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/voice/transcribe` | Audio → Text (multipart/form-data: `audio`) |
| `POST` | `/voice/note` | Lưu ghi chú giọng nói |
| `POST` | `/voice/tts` | Text → Speech |

---

## 🔐 Phân quyền RBAC

```
Chức năng                         Admin   Doctor  Patient
──────────────────────────────────────────────────────────
Admin Dashboard / System info       ✅      ❌      ❌
Quản lý User / Doctor / Service     ✅      ❌      ❌
──────────────────────────────────────────────────────────
Xem tất cả bệnh nhân                ✅      ✅      ❌
Xem hồ sơ cá nhân                  ❌      ❌      ✅
Cập nhật hồ sơ cá nhân             ❌      ❌      ✅
──────────────────────────────────────────────────────────
Tạo / sửa hồ sơ bệnh án            ✅      ✅      ❌
Xem hồ sơ bệnh án                  ✅      ✅    own only
──────────────────────────────────────────────────────────
Đặt lịch hẹn                       ❌      ❌      ✅
Quản lý lịch hẹn (xác nhận...)     ✅      ✅      ❌
Xem lịch hẹn                       ✅      ✅    own only
Huỷ lịch hẹn                       ✅      ✅    own only
──────────────────────────────────────────────────────────
Upload ảnh                          ✅      ✅      ✅
Xem tất cả ảnh                      ✅      ✅      ❌
Xem ảnh của mình                    ❌      ❌      ✅
Phân tích ảnh AI                    ✅      ✅      ❌
──────────────────────────────────────────────────────────
Cập nhật điểm nha khoa              ✅      ✅      ❌
Xem điểm của mình                   ❌      ❌      ✅
──────────────────────────────────────────────────────────
Public Chat (không login)           ✅      ✅      ✅
Private Chat                        ❌      ✅      ✅
Xem lịch sử chat                    ✅(all) ✅(own) ✅(own)
──────────────────────────────────────────────────────────
AI Prediction                       ✅      ✅      ❌
Voice Transcription                 ❌      ✅      ❌
```

---

## 🤖 AI Chatbot

### Chế độ hoạt động

**1. OpenAI GPT (production)**
```env
OPENAI_API_KEY=sk-your-key-here
```
Dùng model `gpt-3.5-turbo` với system prompt chuyên nha khoa, hỗ trợ tiếng Việt và tiếng Anh.

**2. Rule-based Fallback (mặc định, miễn phí)**
Bộ FAQ nha khoa tích hợp sẵn. Hệ thống tự động chuyển sang khi không có API key.

### Public vs Private Chat

| | Public `/chat/public` | Private `/chat/private` |
|-|-----------------------|------------------------|
| Auth | Không cần | Bắt buộc (patient/doctor) |
| Context | Không có | Load từ DB (score + records) |
| Lưu lịch sử | Anonymous session | Gắn với user ID |
| Tư vấn | Chung chung | Cá nhân hoá |

---

## 🖼️ Upload ảnh

### Loại file hỗ trợ

| Loại | Extensions | Thư mục |
|------|-----------|---------|
| Ảnh thông thường | `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` | `uploads/images/` |
| X-Quang | `.dcm`, `.dicom` | `uploads/xrays/` |
| Scan 3D | `.stl`, `.obj`, `.ply` | `uploads/scans/` |
| Audio (voice) | `.webm`, `.ogg`, `.wav`, `.mp3` | `uploads/audio/` |

### Giới hạn
- Ảnh/scan: **10 MB** / file
- Audio: **25 MB** / file
- Rate limit upload: **50 requests / 15 phút**

---

## 📹 Video Call

Sử dụng **WebRTC** peer-to-peer với STUN server của Google.

```
Bệnh nhân ──WebRTC──► Bác sĩ
         ◄──────────
           STUN: stun.l.google.com:19302
```

**Tính năng:**
- Bật/tắt microphone và camera trong cuộc gọi
- Hiển thị thời gian cuộc gọi
- Tự động dọn dẹp stream khi kết thúc

> **Production:** Cần thêm signaling server (Socket.io) và TURN server cho NAT traversal.

---

## 🧪 Chạy test

### Unit Tests *(không cần DB, chạy ngay)*
```bash
cd vinamec-backend
npm run test:unit
# → 66 tests passed, 0 failed
```

Tests: `dateHelpers`, `helpers`, `constants`, `validators`, `asyncHandler`, `response`

### Auth API Tests *(cần server + DB đã seed)*
```bash
# Terminal 1
npm run dev

# Terminal 2
npm test
```

### Integration Tests *(cần server + DB đã seed)*
```bash
npm run test:api
```

---

## 📧 Background Jobs

Hệ thống chạy cron job **tự động** khi server khởi động:

| Job | Thời gian | Mô tả |
|-----|-----------|-------|
| `reminderJob` | Hàng ngày 08:00 | Email nhắc nhở cho lịch hẹn ngày hôm sau |

Jobs dừng gracefully khi server nhận `SIGTERM`.

---

## 🚀 Deploy

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: vinamec_dental

  backend:
    build: ./vinamec-backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongodb:27017/vinamec_dental
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      FRONTEND_URL: https://yourdomain.com
    depends_on:
      - mongodb
    volumes:
      - uploads:/app/uploads

  frontend:
    build: ./vinamec-dental
    ports:
      - "80:80"

volumes:
  mongo_data:
  uploads:
```

```bash
docker-compose up -d
docker-compose exec backend node src/utils/seed.js
```

### PM2 + Nginx

```bash
# Backend
cd vinamec-backend
npm install --production
pm2 start src/server.js --name vinamec-api
pm2 save && pm2 startup

# Frontend
cd vinamec-dental
npm run build
# Copy dist/ tới Nginx root
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/vinamec/dist;

    location / { try_files $uri /index.html; }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

### Checklist Production

- [ ] `JWT_SECRET` ≥ 64 ký tự ngẫu nhiên
- [ ] `NODE_ENV=production`
- [ ] HTTPS (Let's Encrypt)
- [ ] MongoDB authentication bật
- [ ] `FRONTEND_URL` đúng domain
- [ ] Email service cấu hình thật
- [ ] Backup MongoDB định kỳ
- [ ] Monitor logs (`logs/combined.log`, `logs/error.log`)

---

## 🐛 Troubleshooting

**MongoDB connection refused:**
```bash
sudo systemctl start mongod          # Linux
brew services start mongodb-community # macOS
```

**CORS error trên frontend:**
```env
# .env backend
FRONTEND_URL=http://localhost:5173   # Phải khớp chính xác
```

**Thư mục uploads không tồn tại:**
```bash
mkdir -p uploads/images uploads/xrays uploads/scans uploads/audio
```

**JWT expired (401):**
Đăng xuất và đăng nhập lại để lấy token mới. Token hết hạn sau 7 ngày.

**Port đã được dùng:**
```env
PORT=5001   # .env backend
```

**Seed thất bại (duplicate key):**
```bash
# Xoá và seed lại
mongo vinamec_dental --eval "db.dropDatabase()"
npm run seed
```

---

## 📊 Database Schema

```
User (1) ──────────── Patient (1:1)
         ──────────── Doctor  (1:1)
         ──────────── Appointment (N — as patient)
         ──────────── Appointment (N — as doctor)
         ──────────── MedicalRecord (N — as patient)
         ──────────── MedicalRecord (N — as doctor)
         ──────────── ImageAnalysis (N — as patient/uploadedBy)
         ──────────── DentalScore (1:1 — as patient)
         ──────────── ChatHistory (N)

Appointment ────────── Service (N:1)
MedicalRecord ──────── Appointment (N:1, optional)
ImageAnalysis ──────── Appointment (N:1, optional)
DentalScore ────────── User (N:1 — lastAssessedBy)
```

---

## 📄 License

MIT License — tự do sử dụng, chỉnh sửa và phân phối
Được xây dựng cho hệ sinh thái nha khoa Việt Nam 🦷

**VinaMec © 2024**
