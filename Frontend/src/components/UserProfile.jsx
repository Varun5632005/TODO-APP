import React, { useContext } from "react";
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import { motion } from "framer-motion";
import { Mail, Bell, Zap, Shield, User, Settings, Trash2 } from "lucide-react";
import { loginContextObj } from "../contexts/LoginContext";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

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
  const { currentUser, setCurrentUser, userLogout } = useContext(loginContextObj);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const onUpdateProfile = async (data) => {
    try {
      const res = await axios.put(`${API}/user-api/update-profile/${currentUser._id}`, data, { withCredentials: true });
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        toast.success("Profile updated successfully!");
        setShowSettings(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const onDeleteAccount = async () => {
    try {
      const res = await axios.delete(`${API}/user-api/user/${currentUser._id}`, { withCredentials: true });
      if (res.status === 200) {
        toast.success("Account deleted successfully");
        await userLogout();
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };
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
        <Mail size={18} style={{ flexShrink: 0 }} />
        <span style={{ lineHeight: 1.5 }}>
          📬 <strong>Email Reminders are ON!</strong> We'll send a reminder to <strong>{currentUser?.email}</strong> for any task due within the next hour.
        </span>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', background: 'var(--card-bg)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-color)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{currentUser?.name || 'User'}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currentUser?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setValue("name", currentUser?.name); setShowSettings(true); }} className="modern-btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <Settings size={16} /> Edit Profile
          </button>
        </div>
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

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} contentClassName="glass-panel">
        <Modal.Header closeButton closeVariant="white" style={{ borderBottomColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Account Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'var(--text-primary)' }}>
          <form onSubmit={handleSubmit(onUpdateProfile)}>
            <div className="form-group">
              <label>Display Name</label>
              <input type="text" {...register("name", { required: true })} className="modern-input" placeholder="Your name" />
            </div>
            <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>
              Save Changes
            </button>
          </form>

          <hr style={{ borderColor: 'var(--border-color)', margin: '30px 0' }} />
          
          <h5 style={{ color: 'var(--danger-color)', marginBottom: '15px' }}>Danger Zone</h5>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Once you delete your account, there is no going back. Please be certain.</p>
          <button 
            type="button" 
            className="modern-btn danger" 
            style={{ width: '100%' }}
            onClick={() => { setShowSettings(false); setShowDeleteConfirm(true); }}
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} contentClassName="glass-panel" centered>
        <Modal.Body style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '2rem' }}>
          <Trash2 size={48} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
          <h3>Are you sure?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This action cannot be undone. All your tasks will be permanently deleted.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="modern-btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </button>
            <button className="modern-btn danger" style={{ flex: 1 }} onClick={onDeleteAccount}>
              Yes, Delete My Account
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </motion.div>
  );
}

export default UserProfile;
