import express from 'express'
import { signup } from '../controllers/authController.js'
import { login } from '../controllers/authController.js'
import { me } from '../controllers/me.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', verifyAuth, me)

export default router