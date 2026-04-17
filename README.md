# 🚀 User Management System (UMS)

A high-performance, full-stack User Management System with secure **Role-Based Access Control (RBAC)**. This application provides a seamless way to manage users, roles, and profiles with a modern, industry-standard interface.

---

## 🏗 Project Architecture

This is a **monorepo-style** project divided into two main parts:
- **`/backend`**: Node.js & Express API (The Brain)
- **`/frontend`**: React & Tailwind CSS Interface (The Beauty)

---

## ✨ Key Features

### 🔐 Advanced Security & RBAC
*   **JWT Authentication**: Secure stateless login using JSON Web Tokens.
*   **Fine-Grained Permissions**: 
    *   **Admin**: Full CRUD permissions + role management + soft-delete recovery.
    *   **Manager**: Employee management (cannot modify Admin accounts).
    *   **User**: Directory access + self-profile & secure password management.
*   **Encrypted Storage**: Bcrypt hashing (salt-round: 12) for all passwords.

### 📱 Premium User Experience
*   **Adaptive UI**: Dynamic mobile experience with high-retina icons and bottom tab bar navigation.
*   **Real-time Notifications**: Smart toast feedback for validation, authentication, and system events.
*   **Enterprise Tooling**: Instant server-side search, multi-role filtering, and paginated user lists.
*   **Modern Auth Flow**: Professional split-screen login layout with secure demo access.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, vite, React Hot Toast |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT |
| **Security** | BcryptJS, Express Validator, Helmet, Cors |
| **Environment** | Dotenv, ESLint, Prettier |

---

## 🚦 Getting Started

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB Atlas](https://www.mongodb.com/atlas) account or Local MongoDB.

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed  # Crucial: Creates your initial admin account
npm run dev   # Starts on port 8080 by default
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts on port 5173
```

---

## ⚙️ Environment Configuration

### Backend (`/backend/.env`)
| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Connection String |
| `JWT_SECRET` | Secret key for signing tokens |
| `PORT` | API Port (Default: 8080) |

### Frontend (`/frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | URL of your running backend (e.g., http://localhost:8080) |

---

## 🔑 Demo Access

| Role | Email | Password |
| :--- | :--- | :--- |
| **👑 Admin** | `admin@example.com` | `Admin123!` |
| **🛠 Manager** | `manager@example.com` | `Manager123!` |
| **👤 User** | `user@example.com` | `Password123!` |

---

## 📡 API Overview

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/users` | Admin, Manager |
| `POST` | `/api/users` | Admin Only |
| `PUT` | `/api/users/:id` | Admin, Manager |
| `PATCH` | `/api/users/:id/restore` | Admin Only |

---

## 🚀 Deployment Guide

### Production Check-list
1.  **CORS**: Update `origin` in `backend/server.js` to your frontend URL.
2.  **Environment Variables**: Ensure all `.env` variables are set in your platform dashboard (Vercel/Render).
3.  **Build**: Frontend must be built using `npm run build`.

---

Designed for accuracy, security, and a premium developer experience.
