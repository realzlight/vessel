import axios from '../lib/axios.js'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout')
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}