import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { 
  Sparkles, Users, Download, TrendingUp, Settings, LogOut,
  Search, ChevronLeft, ChevronRight, Shield 
} from 'lucide-react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  
  const { user, token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [token, user, router])

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchUsers()
    }
  }, [token, user, pagination.page])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/admin/users?page=${pagination.page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    fetchUsers()
  }

  const updateUserSubscription = async (userId, subscription) => {
    try {
      await axios.put('/api/admin/users',
        { userId, subscription },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchUsers()
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  if (!token || user?.role !== 'admin') {
    return null
  }

  const stats = [
    { label: 'Total Users', value: pagination.total, icon: Users },
    { label: 'This Page', value: users.length, icon: Download },
    { label: 'Pro Users', value: users.filter(u => u.subscription === 'pro').length, icon: TrendingUp },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield }
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
              <span className="bg-accent-500/20 text-accent-400 text-xs px-2 py-1 rounded">Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and monitor platform activity</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10 w-64"
                />
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Subscription</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Downloads</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{u.email}</div>
                            <div className="text-sm text-gray-500">{u.firstName} {u.lastName}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{u.company || '-'}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.subscription}
                            onChange={(e) => updateUserSubscription(u._id, e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            u.role === 'admin' 
                              ? 'bg-accent-500/20 text-accent-400' 
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{u.downloadCount}</td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-primary-400 hover:text-primary-300 text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {users.length} of {pagination.total} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
