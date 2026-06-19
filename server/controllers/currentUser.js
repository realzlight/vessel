import User from '../models/user.js'

export const getCurrentUserData = async (req, res) => {
  try {
    // decoded = { id: "mongoObjectId", username: "john" } from your JWT middleware
    const currentUser = await User.findById(req.user.userId).select("-password");

    if (!currentUser) {
      return res.status(401).json({ message: "No Current User :(" });
    }

    res.status(200).json({
      username: currentUser.username,
      email: currentUser.email
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};