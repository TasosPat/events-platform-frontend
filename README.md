🎨 Community Events Platform (Frontend)

The frontend for the Community Events Platform, a web application where users can explore, attend, and manage community events.

🌐 Live Website

🔗 Production URL:
https://events-platform-frontend.netlify.app/

🧠 Overview

This React + TypeScript frontend allows users to:

Browse upcoming events

Log in / sign up via Firebase Authentication

View event details and attendance info

Staff users can create and edit events

🛠️ Tech Stack

React (Create React App)

TypeScript

Tailwind CSS for styling and responsive design

Firebase Auth for user authentication

Axios for API requests

Deployed on Netlify

⚙️ Environment Variables

The frontend only requires one environment variable:

REACT_APP_API_URL=https://events-platform-backend-ny5b.onrender.com/api


⚠️ This is already configured in the deployed version — you do not need to set it up to test the live app.

▶️ Running Locally (Optional)

If you want to run the project locally:

git clone https://github.com/TasosPat/events-platform-frontend
cd events-platform-frontend
npm install
npm start


Then create a .env file in the root with:

REACT_APP_API_URL=http://localhost:3000/api


Make sure your backend is running locally if you want full functionality.

🧩 Folder Structure
src/
 ┣ components/      → Reusable UI components (EventCard, Navbar, etc.)
 ┣ pages/           → Main app pages (HomePage, EventsPage, LoginPage, etc.)
 ┣ context/         → Auth context and provider
 ┣ services/        → API calls (axios)
 ┣ types/           → TypeScript interfaces
 ┗ App.tsx          → Root application file

✅ Status

The frontend is fully deployed and connected to the live backend:
👉 https://events-platform-backend-ny5b.onrender.com/api/