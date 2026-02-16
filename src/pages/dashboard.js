import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { 
  Sparkles, Download, User, Settings, LogOut,
  TrendingUp, Clock, Star, ArrowRight 
} from 'lucide-react'

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  if (!user) {
    return null
  }

  const stats = [
    { label: 'Downloads', value: user.downloadCount || 0, icon: Download },
    { label: 'Logins', value: user.loginCount || 0, icon: User },
    { label: 'Subscription', value: user.subscription || 'Free', icon: Star },
    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString(), icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-grid">
      <nav className="glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">IntentFlow</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/download" className="text-gray-300 hover:text-white transition-colors">
              Download
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-300 hidden md:inline">
                  {user.firstName || user.email.split('@')[0]}
                </span>
              </div>
              <button 
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName || 'there'}!
          </h1>
          <p className="text-gray-400">
            Manage your account and download IntentFlow
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-4">Get Started</h2>
            <p className="text-gray-400 mb-6">
              Download IntentFlow for your preferred platform and start experiencing the future of productivity.
            </p>
            <Link href="/download" className="btn-primary inline-flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-4">Your Subscription</h2>
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.subscription === 'pro' 
                  ? 'bg-primary-500/20 text-primary-400'
                  : user.subscription === 'enterprise'
                  ? 'bg-accent-500/20 text-accent-400'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {user.subscription === 'pro' ? 'Pro' : user.subscription === 'enterprise' ? 'Enterprise' : 'Free'}
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              {user.subscription === 'free' 
                ? 'Upgrade to Pro for unlimited downloads and advanced features.'
                : user.subscription === 'pro'
                ? 'You have access to all Pro features.'
                : 'Contact us for enterprise pricing and custom solutions.'}
            </p>
            {user.subscription === 'free' && (
              <Link href="/#pricing" className="btn-secondary inline-flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Upgrade to Pro</span>
              </Link>
            )}
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <div className="text-white">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company</label>
                <div className="text-white">{user.company || 'Not specified'}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  <span className="text-white">{user.isVerified ? 'Verified' : 'Pending verification'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/download" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-primary-400" />
                  <span>Download for new platform</span>
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-accent-400" />
                  <span>Account settings</span>
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <span className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>View analytics</span>
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
