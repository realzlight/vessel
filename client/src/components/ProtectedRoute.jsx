import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../lib/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/current-user')
        const fetchedUser = res.data

        // Block access if URL username doesn't match the logged-in user
        if (fetchedUser.username !== username) {
          navigate('/')
          return
        }

        setUser(fetchedUser)
      } catch (err) {
        console.log(err)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username, navigate])

  if (loading) return <LoadingSpinner />
  if (!user) return null

  return children(user)
}