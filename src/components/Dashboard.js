"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import TaskForm from "./TaskForm"
import TaskCard from "./TaskCard"
import ConfirmModal from "./ConfirmModal"
import "./Dashboard.css"
import { database } from "../firebase"
import { ref, onValue, push, set, update, remove } from "firebase/database"

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  console.log(user.uid);

  useEffect(() => {
    if (!user?.uid) return

    const tasksRef = ref(database, `users/${user.uid}/tasks`)
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val()
      const loadedTasks = data
        ? Object.entries(data).map(([id, task]) => ({ id, ...task }))
        : []
      setTasks(loadedTasks)
    })

    return () => unsubscribe()
  }, [user])


  const addTask = async (taskData) => {
  try {
    console.log("Adding task:", taskData)
    const tasksRef = ref(database, `users/${user.uid}/tasks`)
    const newTaskRef = push(tasksRef)
    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString().split("T")[0],
    }
    await set(newTaskRef, newTask)
    console.log("Task successfully added")
  } catch (err) {
    console.error("Failed to add task:", err)
  }
}

  const updateTask = (taskData) => {
    if (editingTask) {
      const taskRef = ref(database, `users/${user.uid}/tasks/${editingTask.id}`)
      update(taskRef, taskData)
      setEditingTask(null)
    }
  }

  const deleteTask = (taskId) => {
    const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`)
    remove(taskRef)
    setTaskToDelete(null)
  }

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const statusOrder = ["Open", "In Progress", "Completed"]
    const currentIndex = statusOrder.indexOf(task.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]

    const taskRef = ref(database, `users/${user.uid}/tasks/${taskId}`)
    update(taskRef, { status: nextStatus })
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3l8-8"></path>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
            </svg>
            <span>Task Manager</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>Hi {user?.displayName}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <TaskForm
              onSubmit={editingTask ? updateTask : addTask}
              initialData={editingTask}
              isEditing={!!editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </aside>

          <section className="tasks-section">
            <h2 className="section-title">Your Tasks</h2>
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => setTaskToDelete(task.id)}
                  onToggleStatus={() => toggleTaskStatus(task.id)}
                />
              ))}
              {tasks.length === 0 && (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3l8-8"></path>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
                  </svg>
                  <h3>No tasks yet</h3>
                  <p>Add your first task to get started!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {taskToDelete && (
        <ConfirmModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => deleteTask(taskToDelete)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  )
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default Dashboard