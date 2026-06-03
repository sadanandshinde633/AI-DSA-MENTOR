# 🤖 AI DSA Mentor

An intelligent Data Structures & Algorithms mentor powered by AI. Get personalized explanations, hints, and guidance on DSA problems — like having a personal tutor available 24/7.

---

## 📁 Project Structure

```
AI-DSA-MENTOR/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                  # Backend (Node.js + Express)
    ├── config/              # DB and app configuration
    ├── controllers/         # Route handler logic
    ├── models/
    │   ├── problem.js       # DSA problem schema
    │   ├── progress.js      # User progress tracking
    │   └── user.js          # User account schema
    ├── routes/              # API route definitions
    ├── services/            # Business logic & AI integration
    ├── seed.js              # Database seeding script
    ├── server.js            # Express app entry point
    └── package.json
```

---

## ✨ Features

- 🧠 **AI-Powered Hints** — Get intelligent, context-aware hints without spoiling the solution
- 📚 **Problem Library** — Curated DSA problems across topics (arrays, trees, graphs, DP, etc.)
- 📈 **Progress Tracking** — Monitor your improvement over time
- 👤 **User Accounts** — Personalized experience with saved progress
- 💬 **Interactive Explanations** — Ask the AI to explain concepts in different ways

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| AI | Claude / OpenAI API |
| Auth | JWT |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- An AI API key (Anthropic or OpenAI)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-dsa-mentor.git
cd ai-dsa-mentor
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-dsa-mentor
JWT_SECRET=your_jwt_secret_here
AI_API_KEY=your_ai_api_key_here
```

Seed the database with initial problems:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

### 3. Set Up the Client

```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/problems` | Fetch all DSA problems |
| GET | `/api/problems/:id` | Get a specific problem |
| POST | `/api/ai/hint` | Get an AI hint for a problem |
| GET | `/api/progress` | Get user's progress |
| POST | `/api/progress` | Update user's progress |

---

## 🌱 Database Seeding

To populate the database with sample DSA problems:

```bash
cd server
node seed.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

> Built with ❤️ to make DSA learning smarter and more accessible.
