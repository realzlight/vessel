import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signup = async (req, res) => {
  try {
    const { email, password, name, username} = req.body

    if (!email ||!password ||!name ||!username) {
      return res.status(400).json({ message: 'All fields required' })
    }

    // Check if email or name already exists
    const existingUser = await User.findOne({
  $or: [
    { email: email.toLowerCase().trim() },
    { username: username.trim() } // ← was name.trim()
  ]
})

    if (existingUser) {
      if (existingUser.email === email.toLowerCase().trim()) {
        return res.status(409).json({ message: 'Email already taken' })
      }
      return res.status(409).json({ message: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      username: username.trim().toLowerCase()
    })

    const token = jwt.sign({ 
  userId: newUser._id,  // ← Change 'id' to 'userId'
  username: newUser.username 
}, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: 'User created', username: newUser.username })

  } catch (error) {
    console.log(error)
    // Handle MongoDB duplicate key error as fallback
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(409).json({ message: `${field} already taken` })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    if (!user.password) {
  return res.status(401).json({ message: 'This account uses Google sign-in' })
}
const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' })
    }

    const token = jwt.sign({ 
  userId: user._id,  // ← Change 'id' to 'userId'
  username: user.username 
}, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ message: 'Login successful', username: user.username })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  })
  res.status(200).json({ message: 'Logged out' })
  
}


export const googleCallback = (req, res) => {
  const user = req.user

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.redirect(`http://localhost:5173/${user.username}`)
}
