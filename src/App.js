"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import SignupPage from "./components/SignupPage"
import Dashboard from "./components/Dashboard"
import "./App.css"
import { auth } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Optional: for better UX

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) return <div>Loading...</div> // Optional loading state

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
