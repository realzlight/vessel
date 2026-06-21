import express from 'express'
import { signup } from '../controllers/authController.js'
import { login } from '../controllers/authController.js'
import { getCurrentUserData } from '../controllers/currentUser.js' // <- fixed name
import { verifyAuth } from '../middlewares/verifyAuth.js'
import { logout } from '../controllers/authController.js'
import passport from '../configs/passport.js'
import { googleCallback } from '../controllers/authController.js'



const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  googleCallback
)

export default router