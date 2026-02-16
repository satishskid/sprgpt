import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { 
  Sparkles, ArrowLeft, Download, Loader, Check, 
  Monitor, Apple, Ubuntu, Globe 
} from 'lucide-react'

export default function DownloadPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('windows')
  const [downloading, setDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [error, setError] = useState('')
  
  const { user, token } = useAuth()
  const router = useRouter()

  const platforms = [
    { id: 'windows', name: 'Windows', icon: Monitor, ext: '.exe' },
    { id: 'macos', name: 'macOS', icon: Apple, ext: '.dmg' },
    { id: 'linux', name: 'Linux', icon: Ubuntu, ext: '.deb' },
    { id: 'chrome', name: 'Chrome', icon: Globe, ext: '' },
    { id: 'firefox', name: 'Firefox', icon: Globe, ext: '' }
  ]

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  const handleDownload = async () => {
    if (!user) return
    
    setDownloading(true)
    setError('')
    
    try {
      const response = await axios.post('/api/download', 
        { platform: selectedPlatform },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data.success) {
        setDownloadComplete(true)
        
        setTimeout(() => {
          window.open(response.data.downloadUrl, '_blank')
        }, 1000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-dots"></div>
      
      <div className="max-w-2xl w-full relative z-10">
        <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="glass-card p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">
            Download IntentFlow
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Select your platform and start using IntentFlow
          </p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id)
                  setDownloadComplete(false)
                }}
                className={`glass-card p-4 text-center cursor-pointer transition-all ${
                  selectedPlatform === platform.id 
                    ? 'ring-2 ring-primary-500 bg-primary-500/10' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <platform.icon className={`w-8 h-8 mx-auto mb-2 ${
                  selectedPlatform === platform.id ? 'text-primary-400' : 'text-gray-400'
                }`} />
                <div className="font-medium text-sm">{platform.name}</div>
                <div className="text-xs text-gray-500 mt-1">v2.4.1</div>
              </button>
            ))}
          </div>
          
          <div className="bg-dark/50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Selected Platform</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {platforms.find(p => p.id === selectedPlatform)?.icon && (
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    {(() => {
                      const Icon = platforms.find(p => p.id === selectedPlatform).icon
                      return <Icon className="w-6 h-6 text-primary-400" />
                    })()}
                  </div>
                )}
                <div>
                  <div className="font-semibold">
                    {platforms.find(p => p.id === selectedPlatform)?.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    Version 2.4.1 • ~50MB
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {downloadComplete ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Download ready! Starting download...
            </div>
          ) : null}
          
          <button
            onClick={handleDownload}
            disabled={downloading || downloadComplete}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating download link...</span>
              </>
            ) : downloadComplete ? (
              <>
                <Check className="w-5 h-5" />
                <span>Download Started!</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download IntentFlow</span>
              </>
            )}
          </button>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-500">
              <p className="mb-2">Installation instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download the installer for your platform</li>
                <li>Run the installer and follow the prompts</li>
                <li>Launch IntentFlow and sign in with your account</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
