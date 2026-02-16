import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      await dbConnect();
      
      const { firstName, lastName, company } = req.body;
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (company) user.company = company;
      
      await user.save();
      
      res.json({
        success: true,
        message: 'Profile updated',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
