import { useForm } from "react-hook-form";
import { useContext } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import axios from "axios";
import toast from 'react-hot-toast';
import { PlusCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function CreateTask() {
  let { currentUser, setCurrentUser } = useContext(loginContextObj);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitNewTask = async (newTask) => {
    try {
      let res = await axios.put(`${API}/user-api/todo/${currentUser._id}`, newTask, {
        withCredentials: true,
      });

      if (res.data.message === 'todo added') {
        setCurrentUser(res.data.payload);
        toast.success("Task created successfully!");
        reset(); // Clear the form
      }
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Create New Task</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>What do you need to get done?</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitNewTask)}>
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            {...register("taskName", { required: true })}
            className="modern-input"
            placeholder="e.g., Buy groceries"
          />
          {errors?.taskName?.type === "required" && <span className="text-danger">Title is required</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            {...register("description", { required: true })}
            className="modern-input"
            placeholder="e.g., Milk, Eggs, Bread"
            rows="4"
            style={{ resize: 'vertical' }}
          ></textarea>
          {errors?.description?.type === "required" && <span className="text-danger">Description is required</span>}
        </div>

        <div className="form-group">
          <label>Due Date & Time (Optional)</label>
          <input
            type="datetime-local"
            {...register("dueDate")}
            className="modern-input"
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>
          <PlusCircle size={20} /> Add Task
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
