import axios from 'axios'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx' // fixed quote

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true  // sends cookies for req.userId

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>  {/* fixed name */}
      <App />
    </UserProvider>
  </StrictMode>
)