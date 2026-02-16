import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { verifyToken } from '../../../lib/auth';

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
  
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      const { page = 1, limit = 20, search = '', subscription = '' } = req.query;
      
      const query = {};
      
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (subscription) {
        query.subscription = subscription;
      }
      
      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await User.countDocuments(query);
      
      res.json({
        success: true,
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Admin get users error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      await dbConnect();
      
      const { userId, subscription, role, isVerified } = req.body;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (subscription) user.subscription = subscription;
      if (role) user.role = role;
      if (typeof isVerified === 'boolean') user.isVerified = isVerified;
      
      await user.save();
      
      res.json({
        success: true,
        message: 'User updated',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Admin update user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect();
      
      const { userId } = req.query;
      
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted'
      });
    } catch (error) {
      console.error('Admin delete user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
