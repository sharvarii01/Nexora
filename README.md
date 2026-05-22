# 🚀 Nexora — AI-Powered Developer Career Copilot

Nexora is a state-of-the-art, full-stack career preparation and technical assessment platform. Powered by Google Gemini AI, Nexora acts as a developer's ultimate career copilot—delivering interactive mock interviews, smart resume parsing and auditing, adaptive roadmap generation, coding sandboxes, and application tracking in a single modern interface.

---

## 🌟 Key Features

### 🎙️ AI Mock Interviews
Simulate real-world technical and behavioral interviews tailored to specific job titles and difficulty levels.
* Real-time interactive messaging powered by **Google Gemini**.
* Actionable AI-driven grading, sentiment analysis, and suggestions for improvement.
* Stores and tracks session history for personal growth mapping.

### 📄 Smart Resume Analyzer
Optimize your resume to pass ATS screeners and impress recruiters.
* Upload a PDF resume processed by a server-side parser.
* Receives detailed score breakdown (formatting, content, impact) from Gemini.
* Recommends tailored keyword adjustments, missing skills, and dynamic rephrasing suggestions.

### 💻 AI Coding Sandbox & Assessments
Test your problem-solving skills in an interactive development environment.
* Range of coding challenges across different difficulty tiers.
* Live code execution with instant AI grading, feedback, and runtime analysis.
* Beautiful code presentation with syntactical highlighting.

### 🗺️ Dynamic Roadmap Generator
Generate highly personalized learning and career roadmap blueprints.
* Set target job roles (e.g., Full Stack Engineer, Devops, Machine Learning).
* Gemini constructs a modular milestone-by-milestone curriculum complete with recommended topics.
* Interactive trackers to check off acquired skills along the way.

### 📊 Job & Skill Tracker
Keep your professional journey organized with an intuitive application dashboard.
* Track outstanding applications, interview schedules, offers, and rejections.
* Visualize your preparation progress over time via sleek charts.

### 🏆 Gamified Leaderboard
Compare your technical evaluation and coding benchmark scores.
* Compete with peers globally or within your cohort.
* Gain points by successfully completing coding tests and receiving stellar mock interview evaluations.

---

## 🛠️ Architecture & Technology Stack

Nexora is built using a highly decoupled monorepo-style structure featuring a Next.js front-end and an Express back-end.

### Frontend
* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router Architecture) & [React 19](https://react.dev/)
* **Styling & Motion**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/) for fluid micro-animations
* **Data Visualization**: [Recharts](https://recharts.org/) for beautiful analytics dashboards
* **State & Networking**: Axios & React Context API (custom Auth & Theme providers)
* **UI Components**: Headless components styled with Tailwind utilizing Radix UI primitives (`dialog`, `tabs`, `avatar`, `progress`)

### Backend
* **Server Framework**: [Express 5.x](https://expressjs.com/) (utilizing modern Async/Await routing configurations)
* **Database & ORM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (plus `mongodb-memory-server` support for developer testing)
* **AI Orchestration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) for direct Gemini API queries
* **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` encryption
* **Middleware**: `helmet` (security headers), `morgan` (dev logging), `multer` (file handling), and `pdf-parse` (extracting text from resumes)

---

## 📂 Project Directory Structure

```text
Nexora/
├── backend/
│   ├── config/             # DB connection & Gemini client initialization
│   ├── middleware/         # JWT-auth guard and request validation
│   ├── models/             # Mongoose schemas (User, InterviewSession, Submission)
│   ├── routes/             # API sub-routers (auth, interview, resume, coding, etc.)
│   ├── server.js           # Server bootstrap and root middleware pipeline
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js Pages (login, dashboard, interview, coding...)
│   │   ├── contexts/       # Auth & Dark/Light Theme state providers
│   │   └── lib/            # Axios API utility wrapper configured with interceptors
│   ├── public/             # Static vectors & images
│   └── package.json
│
└── README.md               # You are here!
```

---

## 🚀 Getting Started

Follow these steps to run the complete Nexora suite locally.

### Prerequisites
* **Node.js** (v18.x or higher)
* **MongoDB** (A local database instance or a MongoDB Atlas cloud cluster URI)
* **Google Gemini API Key** (Retrieve one for free from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Clone & Initialize the Project
Make sure your terminal is configured in the root directory.

```bash
# Initialize dependency tree
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexora    # Or your MongoDB Atlas connection string
JWT_SECRET=your_super_secure_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

#### Frontend Configuration
Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Step 3: Launch Services

To start both the front-end and back-end in concurrent development modes:

#### 1. Start Backend Server
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

#### 2. Start Frontend Server
In a separate terminal:
```bash
cd frontend
npm run dev
# Web application will open on http://localhost:3000
```

Open your browser to [http://localhost:3000](http://localhost:3000) to view Nexora in action!

---

## 🔒 Security Practices
Nexora implements robust production-ready security layers:
1. **HTTP Security Headers**: Powered by `helmet` to mitigate cross-site scripting (XSS) and clickjacking.
2. **Cross-Origin Resource Sharing (CORS)**: Strict origin control restricting communication purely to verified clients.
3. **Data Protection**: Encrypted storage of user credentials using strong-salted cryptographic hashing via `bcryptjs`.
4. **JWT Verification**: Bearer token authentication architecture ensuring routes remain protected against unauthorized actions.

---

## 🤝 Contribution Guidelines
We welcome contributions to expand the Nexora ecosystem! 
1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "feat: Add support for amazing capability"`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request for review.

---

## 📄 License
This project is open-source and licensed under the [ISC License](LICENSE).
