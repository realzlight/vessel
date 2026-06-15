import express from 'express';
import User from '../models/user.js';
import { verifyAuth } from '../middlewares/verifyAuth.js';

const router = express.Router();

router.get('/:username', verifyAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'server error' });
  }
});

export default router;