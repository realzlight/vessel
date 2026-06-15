import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import protectedRoute from './components/protectedRoute.jsx'  // Capital P

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected route - wrap Dashboard inside */}
        <Route
          path="/:username"
          element={
            <ProtectedRoute><Dashboard />
            </ProtectedRoute>
              
            
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App