import React, { useContext } from "react";
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import { motion } from "framer-motion";
import { Mail, Bell, Zap, Shield } from "lucide-react";
import { loginContextObj } from "../contexts/LoginContext";

const features = [
  {
    icon: <Mail size={20} color="#6366f1" />,
    title: "Email Reminders",
    desc: "Get notified 5 min–1 hr before any task is due, straight to your inbox.",
  },
  {
    icon: <Bell size={20} color="#f59e0b" />,
    title: "Smart Scheduling",
    desc: "Set a due date & time on any task and let TaskMaster handle the rest.",
  },
  {
    icon: <Zap size={20} color="#10b981" />,
    title: "Instant Updates",
    desc: "Tasks sync in real-time. No refresh needed — ever.",
  },
  {
    icon: <Shield size={20} color="#ec4899" />,
    title: "Secure & Private",
    desc: "Your tasks are protected with JWT authentication and encrypted sessions.",
  },
];

function UserProfile() {
  const { currentUser } = useContext(loginContextObj);
  const pendingCount = currentUser?.todos?.filter(t => t.status === "pending").length || 0;
  const completedCount = currentUser?.todos?.filter(t => t.status === "completed").length || 0;
  const overdueCount = currentUser?.todos?.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '0 1rem 2rem' }}
    >
      {/* Email Reminder Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="email-banner"
      >
        <Mail size={18} />
        <span>
          📬 <strong>Email Reminders are ON!</strong> We'll send a reminder to <strong>{currentUser?.email}</strong> for any task due within the next hour.
        </span>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="stats-row"
      >
        <div className="stat-card">
          <span className="stat-number">{currentUser?.todos?.length || 0}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card danger">
          <span className="stat-number">{overdueCount}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Create Task Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="glass-panel"
            style={{ padding: '2rem' }}
          >
            <CreateTask />
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="glass-panel"
            style={{ padding: '1.5rem' }}
          >
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>✨ Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{f.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Task List Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-panel"
          style={{ padding: '2rem', minHeight: '600px' }}
        >
          <TaskList />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
