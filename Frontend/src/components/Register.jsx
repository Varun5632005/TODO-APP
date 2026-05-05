import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  //function to form submit
  const onFormSubmit = async (newUser) => {
    newUser.todos = [];
    try {
      //Make HTTP POST req tio create new User in Backend
      let res = await axios.post(`${API}/user-api/user`, newUser);
      
      //if resource is created
      if (res.status === 201) {
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
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
        <h2>Create an Account</h2>
        <p>Join TaskMaster to organize your life.</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            {...register("name", { required: true })} 
            className="modern-input" 
            placeholder="Enter your name" 
          />
          {errors.name?.type === "required" && <span className="text-danger">Name is required</span>}
        </div>
        
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
            placeholder="Create a password"
          />
          {errors.password?.type === "required" && <span className="text-danger">Password is required</span>}
        </div>
        
        <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>
          <UserPlus size={20} /> Register Account
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Register;
