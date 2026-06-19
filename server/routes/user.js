// routes/user.js
import express from 'express'
import { verifyAuth } from '../middleware/auth.js'
import { getCurrentUserData } from '../controllers/userController.js'

const router = express.Router()

router.get('/current-user', verifyAuth, getCurrentUserData)

export default router