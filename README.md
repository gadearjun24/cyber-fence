```markdown
# 🛡 CyberFence – Phishing URL Detection Platform

> A **full-stack phishing URL detection platform** with real-time analysis, admin dashboard, and user management. Built with **Node.js, Express, MongoDB, Socket.IO, and ONNX Runtime**. Styled with a professional **cyber-dark theme**.

---

## 🌐 Features

- **User authentication** (JWT) and role-based access (User/Admin)
- **Real-time phishing URL detection** using **ONNX model**: [pirocheto/phishing-url-detection](https://huggingface.co/pirocheto/phishing-url-detection)
- Admin dashboard with:
  - KPI stats (Total Users, Active/Inactive, Total Uploads)
  - Detection ratios (Phishing/Suspicious/Safe)
  - Upload trends & heatmaps
- **User upload history**
- Real-time notifications via **Socket.IO**
- Secure password hashing (**bcryptjs**)
- Clean, professional **cyber-dark UI** for frontend

---

## 📁 Folder Structure
```

cyberfence-backend/
│
├─ models/
│ ├─ User.js # User schema
│ ├─ PhishingURL.js # URL analysis results
│
├─ routes/
│ ├─ auth.js # Signup/Login endpoints
│ ├─ detect.js # URL detection endpoints
│ ├─ history.js # User history endpoints
│ ├─ admin.js # Admin dashboard & management
│
├─ middleware/
│ └─ auth.js # JWT auth & role validation
│
├─ controller/
│ └─ adminController.js # Admin-related logic
│
├─ cyberFence.js # Phishing URL ONNX detection logic
├─ server.js # Main entry point
├─ package.json
├─ .env # Environment variables
└─ README.md

````

---

## ⚙ Environment Variables (`.env`)

```bash
MONGO_URI=<Your MongoDB connection URI>
PORT=5000
JWT_SECRET=<Random secure string for JWT>
````

> Make sure MongoDB is accessible via your URI.

---

## 🧩 Models

### **User Model (`models/User.js`)**

| Field          | Type                     | Description              |
| -------------- | ------------------------ | ------------------------ |
| `username`     | String, required, unique | Username of the user     |
| `email`        | String, required, unique | User email               |
| `password`     | String, required         | Hashed password          |
| `role`         | String (`user/admin`)    | Role-based access        |
| `isSuspended`  | Boolean, default false   | Admin can suspend users  |
| `uploadsCount` | Number, default 0        | Number of URLs submitted |
| `lastLogin`    | Date                     | Last login timestamp     |

### **PhishingURL Model (`models/PhishingURL.js`)**

| Field        | Type              | Description                               |
| ------------ | ----------------- | ----------------------------------------- |
| `url`        | String, required  | The URL that was checked                  |
| `results`    | Mixed             | Raw model output (probabilities)          |
| `verdict`    | String            | "Phishing" / "Suspicious" / "Safe"        |
| `confidence` | Number            | Confidence score (0-100)                  |
| `checkedAt`  | Date, default now | When the URL was analyzed                 |
| `user`       | ObjectId (`User`) | Reference to the user who checked the URL |

---

## 🔌 Routes

### **1. Authentication (`/api/auth`)**

| Endpoint    | Method | Body                                  | Description               |
| ----------- | ------ | ------------------------------------- | ------------------------- |
| `/register` | POST   | `{ username, email, password }`       | Register new user         |
| `/login`    | POST   | `{ email, password }`                 | Login & receive JWT token |
| `/me`       | GET    | Header: `Authorization: Bearer <JWT>` | Get current user info     |

---

### **2. Phishing Detection (`/api/detect/url`)**

| Endpoint | Method | Body                                | Description          |
| -------- | ------ | ----------------------------------- | -------------------- |
| `/url`   | POST   | `{ urls: ["https://example.com"] }` | Detect phishing URLs |

**Sample Response:**

```json
{
  "success": true,
  "results": [
    {
      "id": "632f0b23...",
      "url": "http://phishing.com",
      "results": { "probability": 0.98 },
      "verdict": "Phishing",
      "confidence": 98.0,
      "user": "631f1a23...",
      "checkedAt": "2025-09-20T08:30:00.000Z"
    }
  ]
}
```

---

### **3. User History (`/api/history`)**

| Endpoint         | Method | Query Params                      | Description                              |
| ---------------- | ------ | --------------------------------- | ---------------------------------------- |
| `/`              | GET    | `?page=1&limit=5&prediction=Safe` | Fetch user upload history                |
| `/reanalyze/:id` | POST   | N/A                               | Re-analyze a URL (future implementation) |

---

### **4. Admin Routes (`/api/admin`)**

| Endpoint     | Method | Description                            |
| ------------ | ------ | -------------------------------------- |
| `/users`     | GET    | List all users with pagination         |
| `/user/:id`  | PATCH  | Update user role / suspend / unsuspend |
| `/user/:id`  | DELETE | Delete user                            |
| `/dashboard` | GET    | Admin stats & analytics (KPI + trends) |

---

## ⚡ Phishing Detection Logic (`cyberFence.js`)

- Uses **ONNX Runtime Node.js**
- Input: array of URLs
- Output: array of `{ url, probability }`
- Verdict assignment:

```javascript
if (probability >= 0.9) verdict = "Phishing";
else if (probability >= 0.5) verdict = "Suspicious";
else verdict = "Safe";
```

- Saves results in MongoDB
- Emits real-time notifications via Socket.IO

**Model Reference:** [pirocheto/phishing-url-detection](https://huggingface.co/pirocheto/phishing-url-detection)

---

## 🖥 Frontend Integration (Info)

- Admin & User dashboards consume `/api/admin/dashboard` and `/api/history`
- Socket.IO updates for completed phishing checks:

```javascript
socket.on("phishing_check_complete", (data) => {
  console.log(data.newResults);
  console.log(data.totalUploads);
});
```

- Frontend classes:

  - `.dashboard-container`, `.kpi-card`, `.chart-card`, `.result-card`
  - Cyber-dark theme: `#0d1117` background, neon accent `#58a6ff`

---

## 📝 Setup Instructions

1. Clone the repository:

```bash
git clone <repo_url>
cd cyberfence-backend
```

2. Install dependencies:

```bash
npm install
```

3. Setup `.env` file:

```bash
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

4. Download ONNX model:

- Place model file at `./models/model.onnx`
- Recommended model: [pirocheto/phishing-url-detection](https://huggingface.co/pirocheto/phishing-url-detection)

5. Start the server:

```bash
npm start
```

6. Access:

- Backend API: `http://localhost:5000/api/...`
- Frontend SPA: `http://localhost:5000/`

---

## 🛠 Technologies

- Node.js & Express
- MongoDB & Mongoose
- ONNX Runtime Node
- Socket.IO
- bcryptjs, jsonwebtoken
- React (Frontend)
- Chart.js / Recharts (Admin KPIs)
- Cyber-dark UI theme

---

## 🔒 Security Notes

- JWT authentication for all protected routes
- Role-based access: user vs admin
- Passwords hashed with bcrypt
- ONNX model used for production-safe phishing detection

---

## 🧠 Model Details

**Model Name:** pirocheto/phishing-url-detection
**Type:** ONNX model for phishing URL classification
**Purpose:** Classifies URLs as Safe, Suspicious, or Phishing

**Input:**

```javascript
const urls = ["https://example.com", "http://phishing-site.com"];
```

**ONNX Node.js Runtime:**

```javascript
const ort = require("onnxruntime-node");
const session = await ort.InferenceSession.create("./models/model.onnx", {
  executionProviders: ["cpu"],
});

const inputTensor = new ort.Tensor("string", urls, [urls.length]);
const results = await session.run({ inputs: inputTensor });
```

**Verdict Assignment:**

```javascript
let verdict;
if (probability >= 0.9) verdict = "Phishing";
else if (probability >= 0.5) verdict = "Suspicious";
else verdict = "Safe";
```

**Output:** Array of probabilities per URL, saved in MongoDB for user history.

---
