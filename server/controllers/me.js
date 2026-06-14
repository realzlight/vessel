import User from '../models/user.js';
import { verifyAuth } from '../middlewares/verifyAuth.js';

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ error: 'server error' });
  }
};