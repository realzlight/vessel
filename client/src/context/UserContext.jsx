import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/current-user', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)