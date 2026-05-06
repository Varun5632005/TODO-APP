import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${API}/user-api/forgot-password`, data, { timeout: 120000 });
      toast.success(res.data.message || "Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="auth-container glass-panel"
    >
      <div className="auth-header">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
        
        <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }} disabled={isLoading}>
          <Mail size={20} /> {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default ForgotPassword;
