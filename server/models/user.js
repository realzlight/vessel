import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   plan: { 
    type: String, 
    enum: ['free', 'pro'], 
    default: 'free' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('User', userSchema)