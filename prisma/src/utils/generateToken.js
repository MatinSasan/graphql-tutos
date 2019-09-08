import jwt from 'jsonwebtoken';
require('dotenv').config();

const generateToken = userId => {
  return jwt.sign({ userId }, process.env.SECRET, { expiresIn: '3h' });
};

export default generateToken;
