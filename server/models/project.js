import mongoose from 'mongoose'

const projectSchema = new Schema({
  name: { type: String, required: true },
  projectId: { type: String, unique: true, required: true },
  description: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { 
    type: String, 
    enum: ['free', 'pro'], 
    default: 'free' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', userSchema)