import express from 'express';
import user from '../models/user.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current logged-in user
router.get('/me', verifyAuth, async (req, res) => {
  try {
    const user = await user.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ error: 'server error' });
  }
});

export default router;