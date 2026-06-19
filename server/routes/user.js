// routes/user.js
import express from 'express'
import { verifyAuth } from '../middleware/verifyAuth.js'
import { getCurrentUserData } from '../routes/user.js'

const router = express.Router()

router.get('/current-user', verifyAuth, getCurrentUserData)

export default router