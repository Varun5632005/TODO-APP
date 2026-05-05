import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import { LogOut, User, LogIn, UserPlus, CheckSquare, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { loginStatus, currentUser, userLogout } = useContext(loginContextObj);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await userLogout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="glass-panel header-bar"
    >
      {/* Logo */}
      <div className="logo">
        <CheckSquare color="var(--primary-color)" size={28} />
        <h2>TaskMaster</h2>
      </div>

      {/* Desktop Nav */}
      <nav className="desktop-nav">
        {loginStatus === false ? (
          <>
            <NavLink to="login" className="modern-btn-outline">
              <LogIn size={18} /> Login
            </NavLink>
            <NavLink to="register" className="modern-btn">
              <UserPlus size={18} /> Register
            </NavLink>
          </>
        ) : (
          <>
            <div className="user-chip">
              <User size={16} color="var(--primary-color)" />
              <span>{currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} className="modern-btn danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
      </nav>

      {/* Hamburger Button (Mobile Only) */}
      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu glass-panel"
          >
            {loginStatus === false ? (
              <>
                <NavLink to="login" className="mobile-menu-item" onClick={closeMenu}>
                  <LogIn size={18} /> Login
                </NavLink>
                <NavLink to="register" className="mobile-menu-item primary" onClick={closeMenu}>
                  <UserPlus size={18} /> Register
                </NavLink>
              </>
            ) : (
              <>
                <div className="mobile-menu-user">
                  <User size={16} color="var(--primary-color)" />
                  <span>{currentUser?.email}</span>
                </div>
                <button className="mobile-menu-item danger" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
