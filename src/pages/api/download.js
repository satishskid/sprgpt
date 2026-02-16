import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { platform } = req.body;
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
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const validPlatforms = ['windows', 'macos', 'linux', 'chrome', 'firefox'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform'
      });
    }
    
    const downloadUrls = {
      windows: 'https://releases.intentflow.com/IntentFlow-2.4.1-windows.exe',
      macos: 'https://releases.intentflow.com/IntentFlow-2.4.1-macos.dmg',
      linux: 'https://releases.intentflow.com/IntentFlow-2.4.1-linux.deb',
      chrome: 'https://chrome.google.com/webstore/detail/intentflow/abc123',
      firefox: 'https://addons.mozilla.org/addon/intentflow/'
    };
    
    user.downloadCount += 1;
    user.platform = platform;
    await user.save();
    
    res.json({
      success: true,
      message: 'Download link generated',
      downloadUrl: downloadUrls[platform],
      expiresIn: 3600,
      version: '2.4.1',
      platform
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Download failed'
    });
  }
}
