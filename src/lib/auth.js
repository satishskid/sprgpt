import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'intentflow-secret-key-change-in-production';

export function generateToken(userId, role = 'user') {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateDownloadToken(userId, platform) {
  return jwt.sign(
    { userId, platform, type: 'download' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}
