import jwt from 'jsonwebtoken';
require('dotenv').config();

const getUserId = (req, requireAuth = true) => {
  const header = req.request.headers.authorization;

  if (header) {
    // const token = header.replace('Bearer', '');
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

export default getUserId;
