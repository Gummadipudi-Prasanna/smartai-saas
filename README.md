# SmartAI SaaS – AI-Powered Content Generation Platform

SmartAI SaaS is a web-based AI content generation platform that helps users create, manage, and organize content through an intuitive dashboard.

## 🚀 Live Demo

**Frontend:** https://smartai-saas-frontend.vercel.app/

**Backend:** https://smartai-saas-backend.onrender.com/

## 📌 Project Overview

SmartAI SaaS is a full-stack web application developed using React.js and Django REST Framework.

The platform allows users to register, log in, generate content, view content history, monitor usage analytics, and manage subscription plans.

## ✨ Features

- User Registration and Login
- JWT Authentication
- Interactive Dashboard
- AI Content Generation
- Multiple Content Types
- Customizable Content Tone and Length
- Content History Management
- Search Generated Content
- Usage Analytics
- Subscription Management
- User Profile Management
- Responsive User Interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- Lucide React

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## 📂 Project Structure

```text
smartai-saas/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ContentGenerator.jsx
│   │   ├── ContentHistory.jsx
│   │   ├── Subscription.jsx
│   │   └── api.js
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── manage.py
│   ├── config/
│   └── applications/
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Gummadipudi-Prasanna/smartai-saas.git

cd smartai-saas
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate virtual environment on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver
```

Backend runs at:

`http://127.0.0.1:8000/`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173/`

## 🔐 Authentication

The application uses JWT-based authentication for user registration and login.

Authentication tokens are stored in browser local storage.

## 📊 Main Modules

| Module | Description |
|---|---|
| Authentication | User registration and login |
| Dashboard | Generation statistics and usage |
| AI Generator | Generate content using selected options |
| Content History | View and manage generated content |
| Subscription | View and manage subscription plans |
| My Profile | User profile information |

## ☁️ Deployment

The application is deployed using:

- Vercel for React frontend hosting
- Render for Django backend hosting
- PostgreSQL for database management

## 🔮 Future Enhancements

- Live AI API integration
- Payment gateway integration
- Advanced content editing
- Download generated content
- Social media content generation
- Improved analytics and reporting

## 👩‍💻 Author

**Prasanna**

GitHub: https://github.com/Gummadipudi-Prasanna

## 📄 License

This project is developed for learning and portfolio purposes.