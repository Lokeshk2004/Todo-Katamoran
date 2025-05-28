"use client"
import PropTypes from "prop-types"
import "./TaskCard.css"

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "#3b82f6"
      case "In Progress":
        return "#f59e0b"
      case "Completed":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="task-card" style={{ borderLeftColor: getStatusColor(task.status) }}>
      <div className="task-header">
        <div className="task-status-container">
          <button
            onClick={onToggleStatus}
            className="status-toggle"
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status === "Completed" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            )}
          </button>
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            <span className="task-status" style={{ color: getStatusColor(task.status) }}>
              {task.status}
            </span>
          </div>
        </div>
        <div className="task-actions">
          <button onClick={onEdit} className="action-btn edit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button onClick={onDelete} className="action-btn delete-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      {task.dueDate && (
        <div className="task-due-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.oneOf(["Open", "In Progress", "Completed"]).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
}

export default TaskCard
