import express from 'express';
import Project from '../models/project.js';
import User from '../models/user.js';
import { verifyAuth } from '../middlewares/verifyAuth.js';

const router = express.Router();

router.get('/:username', verifyAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const projects = await Project.find({ userId: user._id }).sort({
      createdAt: -1
    });

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'server error' });
  }
});

export default router;