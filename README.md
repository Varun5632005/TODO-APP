# 📝 Full Stack Task Management App

A comprehensive, full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js). This application goes beyond simple task management by offering user authentication, secure cookie-based sessions, automated email notifications, and a highly responsive user interface.

## 🚀 Features

- **User Authentication**: Secure user registration and login using JWT and `bcryptjs`. Session management is handled via HTTP-only cookies.
- **Task Management**: Create, read, update, and delete (CRUD) tasks efficiently.
- **Automated Email Reminders**: Backend integration with `node-cron` and `nodemailer` to send automated task notifications and reminders to users.
- **Responsive UI**: A beautiful, responsive frontend built with React, Vite, Bootstrap, and Framer Motion for smooth animations.
- **Secure Backend**: Express server with compression, CORS configuration, and secure routing.
- **Monorepo-like Structure**: Single command to install dependencies for both frontend and backend.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Lightning-fast development environment and optimized builds.
- **React Router DOM**: Client-side routing.
- **React Hook Form**: Efficient, flexible, and extensible forms with easy validation.
- **Axios**: Promise-based HTTP client for API requests.
- **Framer Motion**: For production-ready animations and gestures.
- **Bootstrap & React-Bootstrap**: UI components and responsive grid system.
- **Lucide React**: Beautiful & consistent icons.
- **React Hot Toast**: Smoking hot notifications for React.

### Backend
- **Node.js & Express**: Fast, unopinionated, minimalist web framework.
- **MongoDB & Mongoose**: Elegant mongodb object modeling for node.js.
- **JSON Web Tokens (JWT)**: Secure user authentication.
- **Bcryptjs**: Password hashing.
- **Nodemailer**: Send emails from Node.js.
- **Node-cron**: Task scheduler in pure JavaScript.
- **Cookie Parser**: Parse HTTP request cookies securely.

## 📂 Project Structure

```
TODO-APP/
├── Backend/               # Node.js + Express backend
│   ├── APIs/              # API Route controllers
│   ├── cron/              # Email scheduler configuration
│   ├── middlewares/       # Custom Express middlewares (e.g., auth, errors)
│   ├── models/            # Mongoose schemas
│   ├── server.js          # Entry point for backend
│   └── package.json       # Backend dependencies
├── frontend/              # React + Vite frontend
│   ├── public/            # Static assets
│   ├── src/               # React components, contexts, and assets
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json for running simultaneous scripts
└── render.yaml            # Deployment configuration for Render
```

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster)

## 💻 Installation & Local Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd TODO-APP
   ```

2. **Install all dependencies** (Frontend & Backend):
   ```bash
   npm run install-all
   ```

3. **Environment Variables**:
   Create a `.env` file in the `Backend` folder and configure the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   # Email configuration for nodemailer
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   ```

4. **Run the Application Locally**:
   To start the backend server:
   ```bash
   npm start
   ```
   To start the frontend development server, open a new terminal:
   ```bash
   cd frontend
   npm run dev
   ```

## 🌐 Deployment

This application is ready to be deployed to platforms like **Render**, **Netlify**, or **Vercel**. 
The repository includes a `render.yaml` for streamlined backend service deployment. The frontend is configured to build using `vite build` and can be easily hosted on any static site hosting service.
TASKMANAGER: https://newtaskmanager1.netlify.app/login
## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

---
*Built with ❤️ for a seamless task management experience.*
