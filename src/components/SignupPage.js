import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import "./LoginPage.css"
import { auth, database, googleProvider } from "../firebase"
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { ref, set } from "firebase/database"

const SignupPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      await set(ref(database, "users/" + user.uid), {
        username: formData.username,
        email: formData.email,
        tasks: [],
      })

      onLogin({ name: formData.username, email: formData.email })
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      await set(ref(database, "users/" + user.uid), {
        username: user.displayName,
        email: user.email,
        tasks: [],
      })

      onLogin({ name: user.displayName, email: user.email })
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="user-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        <h1 className="login-title">Create Account</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required placeholder="Enter username" value={formData.username} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} />
          </div>

          <button type="submit" className="sign-in-btn">Sign Up</button>
        </form>

        <div className="divider">or</div>

        <div className="social-buttons">
          <button onClick={handleGoogleSignup} className="social-btn">Sign Up with Google</button>
        </div>

        <p className="switch-mode">
          Already have an account?{" "}
          <Link to="/login" className="switch-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

SignupPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default SignupPage
