import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { loginContextObj } from "../contexts/LoginContext";
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { userLogin, loginErrMessage, loginStatus } = useContext(loginContextObj);
  const navigate = useNavigate();

  //login form submit
  const onLoginFormSubmit = (userCredObj) => {
    userLogin(userCredObj);
  };

  useEffect(() => {
    if (loginErrMessage) {
      toast.error(loginErrMessage);
    }
  }, [loginErrMessage]);

  useEffect(() => {
    if (loginStatus === true) {
      toast.success("Welcome back!");
      navigate("/user-profile");
    }
  }, [loginStatus, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="auth-container glass-panel"
    >
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Log in to manage your tasks effectively.</p>
      </div>

      <form onSubmit={handleSubmit(onLoginFormSubmit)}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            {...register("email", { required: true })} 
            className="modern-input" 
            placeholder="Enter your email" 
          />
          {errors.email?.type === "required" && <span className="text-danger">Email is required</span>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="modern-input"
            placeholder="Enter your password"
          />
          {errors.password?.type === "required" && <span className="text-danger">Password is required</span>}
        </div>
        
        <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>
          <LogIn size={20} /> Login
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;
