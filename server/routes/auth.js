import express from 'express'
import { signup } from '../controllers/authController.js'
import { login } from '../controllers/authController.js'
import { getCurrentUserData } from '../controllers/currentUser.js' // <- fixed name
import { verifyAuth } from '../middlewares/verifyAuth.js'
import { logout } from '../controllers/authController.js'


const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)


export default router