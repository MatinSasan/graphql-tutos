import bcrypt from 'bcryptjs';

const hashPass = password => {
  if (password.length < 5) {
    throw new Error('Password must be 5 characters or longer');
  }

  return bcrypt.hash(password, 10);
};

export default hashPass;
