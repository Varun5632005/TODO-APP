import { useContext, useState, useCallback, useEffect, useRef } from "react";
import { loginContextObj } from "../contexts/LoginContext";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { CheckCircle } from "lucide-react";
import TaskItem from "./TaskItem";
import { AnimatePresence, motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

function TaskList() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);
  const { register, handleSubmit, setValue } = useForm();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  //modal state
  const [modalState, setModalState] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  // Reminder Logic: Check for upcoming tasks every minute
  const alertedTasks = useRef(new Set());
  
  useEffect(() => {
    const checkReminders = () => {
      if (!currentUser?.todos) return;
      
      const now = new Date();
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
      
      currentUser.todos.forEach(todo => {
        if (todo.status === 'pending' && todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          
          // If due in next 10 mins and not already alerted this session
          if (dueDate > now && dueDate <= tenMinutesFromNow && !alertedTasks.current.has(todo._id)) {
            const minutesLeft = Math.round((dueDate - now) / 60000);
            
            toast(`Reminder: "${todo.taskName}" is due in ${minutesLeft} minutes!`, {
              icon: '⏰',
              duration: 10000,
              style: {
                borderRadius: '10px',
                background: '#1e293b',
                color: '#fff',
                border: '1px solid var(--primary-color)'
              },
            });
            
            alertedTasks.current.add(todo._id);
          }
        }
      });
    };

    // Initial check
    checkReminders();
    // Run every 60 seconds
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [currentUser?.todos]);

  const openModal = useCallback((taskObj) => {
    setModalState(true);
    setValue("taskName", taskObj.taskName);
    setValue("description", taskObj.description);
    if(taskObj.dueDate) {
      // Format date for datetime-local (YYYY-MM-DDThh:mm)
      const dateObj = new Date(taskObj.dueDate);
      // Adjust for local timezone offset
      const tzoffset = dateObj.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(dateObj - tzoffset)).toISOString().slice(0, 16);
      setValue("dueDate", localISOTime);
    } else {
      setValue("dueDate", "");
    }
    setTaskBeingEdited(taskObj);
  }, [setValue]);

  const closeModal = useCallback(() => {
    setModalState(false);
  }, []);

  //save modified task
  const saveModifiedTask = useCallback(async (modifiedTaskObj) => {
    try {
      if (modifiedTaskObj.dueDate) {
        modifiedTaskObj.dueDate = new Date(modifiedTaskObj.dueDate).toISOString();
      }
      let res = await axios.put(
        `${API}/user-api/edit-todo/userid/${currentUser._id}/taskid/${taskBeingEdited._id}`,
        modifiedTaskObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        toast.success("Task updated!");
        closeModal();
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  }, [currentUser?._id, taskBeingEdited?._id, setCurrentUser, closeModal]);

  const setTaskCompleted = useCallback(async (taskid) => {
    try {
      let res = await axios.put(
        `${API}/user-api/edit-status/userid/${currentUser._id}/taskid/${taskid}`,
        null,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        toast.success("Task marked as completed!");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  }, [currentUser?._id, setCurrentUser]);

  //delete a task
  const deleteTask = useCallback(async (taskid) => {
    try {
      let res = await axios.put(`${API}/user-api/delete-todo/userid/${currentUser._id}/taskid/${taskid}`, null, { withCredentials: true });
      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        toast.success("Task deleted");
      }
    } catch (err) {
      toast.error("Failed to delete task");
    }
  }, [currentUser?._id, setCurrentUser]);

  const filteredTodos = currentUser?.todos?.filter(todo => {
    const matchesSearch = todo.taskName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : todo.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  if (!currentUser?.todos || currentUser.todos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '3rem 1rem' }}
      >
        <CheckCircle size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>No tasks yet</h3>
        <p style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Create your first task to get started!</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Your Tasks</h2>
        
        <div className="task-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end' }}>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="modern-input" 
            style={{ margin: 0, height: '38px', width: 'auto', flex: '1 1 150px', maxWidth: '250px', padding: '0 12px', fontSize: '0.9rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="modern-input" 
            style={{ margin: 0, height: '38px', width: 'auto', padding: '0 30px 0 12px', fontSize: '0.9rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={async () => {
              try {
                toast.loading("Sending test email...", { id: 'test-email' });
                await axios.post(`${API}/user-api/send-test-email`, { email: currentUser.email });
                toast.success("Test email sent! Check your inbox.", { id: 'test-email' });
              } catch (err) {
                toast.error("Email failed. Check Render Environment Variables.", { id: 'test-email' });
              }
            }}
            className="modern-btn-outline" 
            style={{ height: '38px', padding: '0 16px', fontSize: '0.85rem' }}
          >
            Test Email
          </button>
          <span style={{ display: 'flex', alignItems: 'center', height: '38px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-color)', padding: '0 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {filteredTodos.length} Tasks
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AnimatePresence>
          {filteredTodos.length > 0 ? filteredTodos.map((todoObj) => (
            <TaskItem 
              key={todoObj._id}
              todoObj={todoObj}
              openModal={openModal}
              deleteTask={deleteTask}
              setTaskCompleted={setTaskCompleted}
            />
          )) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No tasks match your filters.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* modal */}
      <Modal show={modalState} onHide={closeModal} contentClassName="glass-panel">
        <Modal.Header closeButton closeVariant="white" style={{ borderBottomColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'var(--text-primary)' }}>
          <form onSubmit={handleSubmit(saveModifiedTask)}>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" {...register("taskName")} className="modern-input" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea {...register("description")} className="modern-input" rows="3"></textarea>
            </div>
            <div className="form-group">
              <label>Due Date & Time</label>
              <input 
                type="datetime-local" 
                {...register("dueDate")} 
                className="modern-input" 
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <button type="submit" className="modern-btn" style={{ width: '100%', marginTop: '10px' }}>
              Save Changes
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskList;