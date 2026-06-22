import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  githubRepo: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deployment: {
    status: { type: String, enum: ['idle', 'deployed'], default: 'idle' },
    interval: { type: String, enum: ['15min', '30min', '1hr', '5hr', '10hr', '24hr', '7days'], default: '30min' },
    lastDeployed: { type: Date, default: null },
    changelogHtml: { type: String, default: '' },
    isAutoDeployEnabled: { type: Boolean, default: true }
  }
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
