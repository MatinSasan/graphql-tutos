import jwt from 'jsonwebtoken';
require('dotenv').config();

const getUserId = req => {
  const header = req.request.headers.authorization;

  if (!header) {
    throw new Error('Authentication required');
  }

  // const token = header.replace('Bearer', '');
  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.SECRET);

  return decoded.userId;
};

export default getUserId;
