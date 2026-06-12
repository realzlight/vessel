import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email ||!password ||!name) {
      return res.status(400).json({ message: 'All fields required' })
    }

    // Check if email or name already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { name: name.trim() }
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
      name: name.trim()
    })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: 'User created', user: { id: newUser._id, name: newUser.name } })

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