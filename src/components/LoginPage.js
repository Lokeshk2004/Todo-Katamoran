import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import "./LoginPage.css"
import { auth, database, googleProvider } from "../firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { ref, get, set } from "firebase/database"

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      const snapshot = await get(ref(database, "users/" + user.uid))
      const userData = snapshot.val()

      onLogin({ name: userData?.username || "User", email: user.email})
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log(user.uid);
      const userRef = ref(database, "users/" + user.uid)
      const snapshot = await get(userRef)

      if (!snapshot.exists()) {
        await set(userRef, {
          username: user.displayName,
          email: user.email,
    

          tasks: [],
        })
      }

      onLogin({ displayName: user.displayName, email: user.email , uid : user.uid })
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

        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
          </div>

          <button type="submit" className="sign-in-btn">Login</button>
        </form>

        <div className="divider">or</div>

        <div className="social-buttons">
          <button onClick={handleGoogleLogin} className="social-btn">Login with Google</button>
        </div>

        <p className="switch-mode">
          Don’t have an account?{" "}
          <Link to="/signup" className="switch-link">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default LoginPage
