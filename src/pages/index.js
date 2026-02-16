import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Zap, Shield, Brain, Globe, Download, ChevronRight, 
  Check, Star, ArrowRight, Cpu, Layers,
  Sparkles, Keyboard, Target, Clock, TrendingUp, Server,
  Cloud, Key, Users, Microscope, Search, BookOpen,
  Workflow, GitBranch, Database, Lock, Terminal, Plus, X,
  ExternalLink, Copy, RefreshCw, Hash, Link as LinkIcon
} from 'lucide-react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showAddModel, setShowAddModel] = useState(false)
  const [newsIndex, setNewsIndex] = useState(0)

  const modelNews = [
    { model: 'Qwen2.5-72B', source: 'HuggingFace', time: '2h ago', type: 'New' },
    { model: 'DeepSeek-V2', source: 'HuggingFace', time: '5h ago', type: 'Trending' },
    { model: 'Llama3-70B', source: 'Meta', time: '1d ago', type: 'Update' },
    { model: 'Mistral-8x22B', source: 'Mistral', time: '2d ago', type: 'New' },
    { model: 'Phi-4', source: 'Microsoft', time: '3d ago', type: 'Release' },
    { model: 'Gemini-1.5-Pro', source: 'Google', time: '5d ago', type: 'Update' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % modelNews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  const allModels = [
    { name: 'Ollama', type: 'Local', category: 'Local', icon: Server },
    { name: 'LM Studio', type: 'Local', category: 'Local', icon: Server },
    { name: 'GPT-4o', type: 'Cloud', provider: 'OpenAI', free: true, apiUrl: 'https://platform.openai.com/api-keys', icon: Cloud },
    { name: 'GPT-4 Turbo', type: 'Cloud', provider: 'OpenAI', apiUrl: 'https://platform.openai.com/api-keys', icon: Cloud },
    { name: 'o1-preview', type: 'Cloud', provider: 'OpenAI', apiUrl: 'https://platform.openai.com/api-keys', icon: Cloud },
    { name: 'Claude 3.5 Sonnet', type: 'Cloud', provider: 'Anthropic', free: true, apiUrl: 'https://console.anthropic.com/settings/keys', icon: Cloud },
    { name: 'Claude 3 Opus', type: 'Cloud', provider: 'Anthropic', apiUrl: 'https://console.anthropic.com/settings/keys', icon: Cloud },
    { name: 'Gemini 1.5 Pro', type: 'Cloud', provider: 'Google', free: true, apiUrl: 'https://aistudio.google.com/app/apikey', icon: Cloud },
    { name: 'Gemini 1.5 Flash', type: 'Cloud', provider: 'Google', free: true, apiUrl: 'https://aistudio.google.com/app/apikey', icon: Cloud },
    { name: 'Llama 3.1 405B', type: 'Cloud', provider: 'Meta', apiUrl: 'https://ai.meta.com/llama/', icon: Cloud },
    { name: 'Mistral Large', type: 'Cloud', provider: 'Mistral', apiUrl: 'https://console.mistral.ai/api-keys/', icon: Cloud },
    { name: 'Command R+', type: 'Cloud', provider: 'Cohere', free: true, apiUrl: 'https://dashboard.cohere.com/api-keys', icon: Cloud },
    { name: 'Grok-beta', type: 'Cloud', provider: 'xAI', apiUrl: 'https://console.x.ai/', icon: Cloud },
    { name: 'Qwen2-72B', type: 'HuggingFace', provider: 'HuggingFace', apiUrl: 'https://huggingface.co/settings/tokens', icon: Globe },
    { name: 'Qwen2-7B', type: 'HuggingFace', provider: 'HuggingFace', free: true, apiUrl: 'https://huggingface.co/settings/tokens', icon: Globe },
    { name: 'Mistral-7B', type: 'HuggingFace', provider: 'HuggingFace', free: true, apiUrl: 'https://huggingface.co/settings/tokens', icon: Globe },
    { name: 'Phi-3-mini', type: 'HuggingFace', provider: 'Microsoft', free: true, apiUrl: 'https://huggingface.co/settings/tokens', icon: Globe },
    { name: 'Falcon-40B', type: 'HuggingFace', provider: 'TII', apiUrl: 'https://huggingface.co/settings/tokens', icon: Globe },
  ]

  const categories = ['All', 'Local', 'OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere', 'HuggingFace']
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredModels = activeCategory === 'All' ? allModels : allModels.filter(m => m.category === activeCategory)

  return (
    <div className="min-h-screen bg-grid">
      {/* News Ticker */}
      <div className="bg-gradient-to-r from-accent-900/50 via-primary-900/50 to-accent-900/50 border-b border-primary-500/20 py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-400 flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            <span className="font-medium">Model News</span>
          </div>
          <div className="overflow-hidden flex-1">
            <motion.div key={newsIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center space-x-3 text-sm">
              <span className="px-2 py-0.5 bg-accent-500/20 text-accent-400 rounded text-xs font-medium">{modelNews[newsIndex].type}</span>
              <span className="text-gray-300">{modelNews[newsIndex].model}</span>
              <span className="text-gray-500">from</span>
              <span className="text-primary-400">{modelNews[newsIndex].source}</span>
              <span className="text-gray-500">{modelNews[newsIndex].time}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">IntentFlow</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#models" className="text-gray-300 hover:text-white">Models</a>
            <a href="#modes" className="text-gray-300 hover:text-white">Modes</a>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link href="/login" className="text-gray-300 hover:text-white">Sign In</Link>
              <Link href="/register" className="btn-primary">Get Started</Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-dots"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-300">{allModels.length}+ Models Supported</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                One Interface.<br/>
                <span className="gradient-text">Every AI Model</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Connect to ALL AI models. Local, Cloud, HuggingFace - all in one place. 
                Bring your own keys. Leverage free tiers for testing.
              </p>
              <div className="flex gap-4 mb-8">
                <Link href="/register" className="btn-primary inline-flex items-center space-x-2">
                  <span>Start Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#models" className="btn-secondary">Browse Models</a>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2"><Server className="w-4 h-4 text-primary-400" /><span>Local</span></div>
                <div className="flex items-center space-x-2"><Cloud className="w-4 h-4 text-accent-400" /><span>Cloud</span></div>
                <div className="flex items-center space-x-2"><Globe className="w-4 h-4 text-green-400" /><span>HuggingFace</span></div>
                <div className="flex items-center space-x-2"><Lock className="w-4 h-4 text-yellow-400" /><span>BYOK</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="glass-card p-6 pulse-glow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2"><Brain className="w-5 h-5 text-primary-500" /><span className="font-semibold">IntentFlow Terminal</span></div>
                  <div className="flex space-x-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                </div>
                <div className="bg-dark/50 rounded-lg p-3 mb-4 font-mono text-sm">
                  <div className="text-gray-500 mb-2">$ Connected Models:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between"><span className="text-gray-300">GPT-4o (OpenAI)</span><span className="text-xs text-green-400">Connected</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-300">Claude 3.5 (Anthropic)</span><span className="text-xs text-green-400">Connected</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-300">Qwen2-72B (HF)</span><span className="text-xs text-green-400">Connected</span></div>
                  </div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2"><Terminal className="w-4 h-4" /><span>Query: "Compare GPT-4o vs Claude 3.5"</span></div>
                  <div className="text-xs text-green-400">Processing with Council Mode (2 models)...</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Models */}
      <section id="models" className="py-20 px-6 bg-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4"><span className="gradient-text">All Models</span> Supported</h2>
            <p className="text-xl text-gray-400">Click any model to get your API key from the provider</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'glass hover:bg-gray-800 text-gray-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <button onClick={() => setShowAddModel(true)} className="btn-primary inline-flex items-center space-x-2"><Plus className="w-5 h-5" /><span>Add Custom Model</span></button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModels.map((model, index) => (
              <motion.a key={index} href={model.apiUrl} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-4 hover:ring-2 hover:ring-primary-500/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <model.icon className="w-4 h-4 text-primary-400" />
                    <span className="font-medium text-sm">{model.name}</span>
                  </div>
                  {model.free && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Free</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{model.provider || model.category}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Three <span className="gradient-text">Reasoning Modes</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Single Mode', desc: 'Use one model for simple queries', icon: Brain },
              { name: 'Council Mode', desc: 'Multiple models debate & reach consensus', icon: Users },
              { name: 'Co-Scientist Mode', desc: 'Deep research with hypothesis testing', icon: Microscope },
            ].map((mode, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6">
                  <mode.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                <p className="text-gray-400">{mode.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto glass-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to unify your AI?</h2>
          <p className="text-gray-400 mb-8">Join researchers and engineers using IntentFlow</p>
          {submitted ? (
            <div className="flex items-center justify-center space-x-2 text-green-400"><Check className="w-5 h-5" /><span>Thanks!</span></div>
          ) : (
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field flex-1" />
              <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap disabled:opacity-50">
                {isSubmitting ? 'Joining...' : 'Get Started'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">IntentFlow</span>
            </div>
            <p className="text-gray-500 text-sm">2026 IntentFlow. Open Source + Cloud.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
