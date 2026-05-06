import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.put(`${API}/user-api/reset-password/${token}`, {
        password: data.password
      });
      toast.success(res.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
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
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>New Password</label>
          <input 
            type="password" 
            {...register("password", { required: true, minLength: 6 })} 
            className="modern-input" 
            placeholder="Enter new password" 
          />
          {errors.password?.type === "required" && <span className="text-danger">Password is required</span>}
          {errors.password?.type === "minLength" && <span className="text-danger">Minimum 6 characters required</span>}
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            {...register("confirmPassword", { 
              required: true,
              validate: (val) => {
                if (watch('password') != val) {
                  return "Passwords do not match";
                }
              }
            })} 
            className="modern-input" 
            placeholder="Confirm new password" 
          />
          {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message || "Confirm Password is required"}</span>}
        </div>
        
        <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }} disabled={isLoading}>
          <Lock size={20} /> {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </motion.div>
  );
}

export default ResetPassword;
