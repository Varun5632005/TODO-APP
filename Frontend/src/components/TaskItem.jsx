import React from "react";
import { Trash2, Edit2, CheckCircle, Circle, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const TaskItem = React.memo(({ todoObj, openModal, deleteTask, setTaskCompleted }) => {
  // Check if task is overdue
  const isOverdue = todoObj.dueDate && new Date(todoObj.dueDate) < new Date() && todoObj.status !== 'completed';
  
  // Format dates
  const createdDate = new Date(todoObj.createdAt).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const dueDate = todoObj.dueDate 
    ? new Date(todoObj.dueDate).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }) 
    : 'No due date';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: todoObj.status === 'completed' ? 0.7 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      style={{ 
        padding: '20px', 
        background: 'rgba(15, 23, 42, 0.4)', 
        borderRadius: '12px',
        border: `1px solid ${todoObj.status === 'completed' ? 'var(--success-color)' : (isOverdue ? 'var(--danger-color)' : 'var(--border-color)')}`,
        boxShadow: isOverdue ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none'
      }}
      className="task-card-hover"
    >
      <div className="task-item-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: '1 1 auto', minWidth: '200px' }}>
          <div style={{ marginTop: '2px' }}>
            {todoObj.status === 'completed' ? 
              <CheckCircle size={20} color="var(--success-color)" /> : 
              <Circle size={20} color="var(--primary-color)" />
            }
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', textDecoration: todoObj.status === 'completed' ? 'line-through' : 'none', wordBreak: 'break-word' }}>
            {todoObj.taskName}
          </h3>
        </div>
        
        <div className="task-item-actions" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => openModal(todoObj)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
            title="Edit Task"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => deleteTask(todoObj._id)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', margin: '0 0 15px 30px', fontSize: '0.95rem', textDecoration: todoObj.status === 'completed' ? 'line-through' : 'none' }}>
        {todoObj.description}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginLeft: '30px', marginBottom: '15px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Clock size={12} /> Created: {createdDate}
        </span>
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem',
          color: isOverdue ? 'var(--danger-color)' : 'var(--text-secondary)'
        }}>
          <Calendar size={14} color={isOverdue ? 'var(--danger-color)' : 'var(--primary-color)'} /> Due: {dueDate} {isOverdue && '(Overdue)'}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginLeft: '30px', gap: '10px' }}>
        <span style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '0.8rem', 
          padding: '4px 10px', 
          borderRadius: '4px',
          background: todoObj.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          color: todoObj.status === 'completed' ? 'var(--success-color)' : '#f59e0b'
        }}>
          <Clock size={12} />
          {todoObj.status.charAt(0).toUpperCase() + todoObj.status.slice(1)}
        </span>
        
        {todoObj.status === "pending" && (
          <button 
            onClick={() => setTaskCompleted(todoObj._id)}
            style={{ 
              background: 'var(--success-color)', color: 'white', border: 'none', 
              padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Complete Task
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default TaskItem;
