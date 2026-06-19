import express from 'express'
import { signup } from '../controllers/authController.js'
import { login } from '../controllers/authController.js'
import { currentUser } from '../controllers/currentUser.js' // <- fixed name
import { verifyAuth } from '../middlewares/verifyAuth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/current-user', verifyAuth, currentUser)

export default router