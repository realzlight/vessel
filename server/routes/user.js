// routes/user.js
import express from 'express'
import { verifyAuth } from '../middlewares/verifyAuth.js'
import { getCurrentUserData } from '../controllers/currentUser.js'

const router = express.Router()

router.get('/current-user', verifyAuth, getCurrentUserData)

export default router