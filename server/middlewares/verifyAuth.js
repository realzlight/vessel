import jwt from 'jsonwebtoken';

export const verifyAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
console.log("decoded:", decoded) // add this temp log
req.user = decoded
    next();
  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
};