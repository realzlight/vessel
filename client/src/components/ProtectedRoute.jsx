// ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/current-user', {
          method: 'GET',
          credentials: 'include', // sends the cookie automatically
        })

        if (!res.ok) {
          navigate('/')
          return
        }

        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.log(err)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return children(user)
}