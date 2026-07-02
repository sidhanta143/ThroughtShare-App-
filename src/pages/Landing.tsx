import React, { useState, useEffect } from 'react';
import img from '../../assets/ss.jpg';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, UploadCloud, FolderUp, RotateCcw, 
  Pocket, Share2, Cloud, Users, CheckCircle2, 
  ArrowUpRight, Heart, Star, Sparkles, Files, 
  Lock, Zap, RefreshCw, Layers
} from 'lucide-react';
import { useAppState } from '../context/AppContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, theme, toggleTheme } = useAppState();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Animated numbers simulator on landing page load
  const [processedCount, setProcessedCount] = useState(942000);
  const [usersCount, setUsersCount] = useState(48900);

  useEffect(() => {
    const handle = setInterval(() => {
      setProcessedCount(prev => prev + Math.floor(Math.random() * 5 + 1));
      if (Math.random() > 0.8) {
        setUsersCount(prev => prev + 1);
      }
    }, 2500);
    return () => clearInterval(handle);
  }, []);

  const features = [
    { icon: UploadCloud, title: 'File Upload', desc: 'Drag-and-drop secure file transfers up to 2GB on free tiers with fast client-side buffering.' },
    { icon: FolderUp, title: 'Folder Upload', desc: 'Transfer complete nested directories, automatically reconstructed in hierarchical views.' },
    { icon: RotateCcw, title: 'File Conversion', desc: 'Seamlessly convert between PDF, Word (.docx), text formats, and popular markup styles.' },
    { icon: Sparkles, title: 'Image Compression', desc: 'Harness canvas compressors to trim image payloads (PNG/JPG) with real-time quality previews.' },
    { icon: Share2, title: 'Secure Sharing', desc: 'Configure link passwords, toggle download tickers, and establish strict expiration intervals.' },
    { icon: Cloud, title: 'Cloud Storage', desc: 'All files and folders are buffered in high-performance cloud cache storage, always available.' },
    { icon: Users, title: 'Team Collaboration', desc: 'Invite peers to write logs, download documents and inspect transformed layout structures.' },
    { icon: Zap, title: 'Instant Download', desc: 'Fetch single items, custom files, or compiled folder packages in a single click instantly.' },
  ];

  const steps = [
    { num: '01', title: 'Upload Files & Folders', desc: 'Drag files or directory folders onto the workspace dashboard. Dynamic previews appear instantly.' },
    { num: '02', title: 'Transform & Organize', desc: 'Select conversions (e.g. PDF to Word, image compression), set output quality, and nest folders.' },
    { num: '03', title: 'Share & Download', desc: 'Generate encrypted public links, specify passwords, and download files directly in bulk.' },
  ];

  const stats = [
    { label: 'Files Processed', count: `${(processedCount / 1000000).toFixed(2)}M+` },
    { label: 'Active Users', count: `${(usersCount / 1000).toFixed(1)}K+` },
    { label: 'Uptime SLA', count: '99.99%' },
    { label: 'Supported Formats', count: '100+' },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Creative Director at PixelStudio',
      quote: 'TransForma saves our team hours every week. Compressing PNG assets directly in-browser before packaging client presentations is exceptionally clean!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
    },
    {
      name: 'G Sidhnata Dora',
      role: 'CEO at ThroughtShare',
      quote: 'As CEO of ThroughtShare, I am dedicated to building secure, innovative file-sharing solutions that simplify collaboration and empower users worldwide.',
      rating: 5,
      avatar: img
    },
    {
      name: 'Elena Rostova',
      role: 'Freelance Document Analyst',
      quote: 'Converting contractual PDFs into editable Word formats is pixel-perfect. Password-protected expirations give my clients absolute security.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '0',
      desc: 'Perfect for quick individual document and asset tasks.',
      features: [
        'Storage allocation: 10 GB',
        'Max upload size: 100 MB',
        'Basic doc translators (PDF to Word)',
        'Canvas JPEG compression',
        'Public sharing links (no passwords)'
      ],
      cta: 'Start Free Account',
      popular: false
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? '12' : '9',
      desc: 'The best all-in-one suite for creators, managers and remote builders.',
      features: [
        'Storage allocation: 250 GB',
        'Max upload size: 2 GB',
        'Full high-speed transform engine',
        'Encrypted share links & passwords',
        'Team active folder sharing',
        'No rate limits on operations'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? '49' : '39',
      desc: 'Custom security controls and deep dedicated integrations.',
      features: [
        'Storage allocation: Unlimited',
        'Max upload size: 50 GB',
        'Dedicated secure servers',
        'Whitelabel custom share pages',
        'Active group permissions',
        'Personal 24/7 success engineer'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-zinc-950/70 border-b border-gray-100 dark:border-zinc-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <RefreshCw className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-zinc-300">
           ThroughtShare
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 transition-colors cursor-pointer"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
          
          <button
            onClick={() => navigate('/auth')}
            className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-all hover:scale-103 cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Background decorative glows */}
        <div className="absolute top-10 left-1/4 -translate-x-1/2 w-80 h-80 bg-indigo-200/40 dark:bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100/40 dark:border-indigo-900/30"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">All-in-One Engine v3.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-950 dark:text-white leading-[1.1]"
          >
            Transform, Organize & Share <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Files Effortlessly</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-zinc-400 max-w-xl leading-relaxed"
          >
            The premium workspace utility that optimizes, converts, and packages document archives, images, and nested directory streams entirely inside a gorgeous workspace interface.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-102 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#features"
              className="px-6 py-3.5 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-850 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors rounded-xl text-sm font-semibold text-gray-800 dark:text-zinc-200 cursor-pointer text-center"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Animated illustration of file management */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl p-6 bg-white/70 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 shadow-2xl backdrop-blur-sm flex flex-col justify-between overflow-hidden group">
            
            {/* Visual files interface overlay */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">Pipeline Terminal</span>
            </div>

            {/* Converting file stream block */}
            <div className="my-auto space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800/80 p-3 rounded-2xl">
                <Files className="w-7 h-7 text-indigo-500 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-xs text-gray-800 dark:text-zinc-250 truncate">Original_SaaS_Assets.zip</p>
                  <p className="text-[10px] text-gray-400">145 MB • Extracted Streams</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">SOURCE</span>
              </div>

              <div className="flex justify-center my-1 text-gray-300 dark:text-zinc-700 animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin-slow text-indigo-500" />
              </div>

              <div className="flex items-center gap-4 bg-gradient-to-tr from-indigo-500 to-purple-600 p-3.5 rounded-2xl text-white shadow-xl">
                <CheckCircle2 className="w-7 h-7 text-indigo-200 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-xs truncate">Compressed_Saas_Docs.pdf</p>
                  <p className="text-[10px] text-indigo-100">12.8 MB • Compressed 11.3x</p>
                </div>
                <div className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold uppercase shrink-0">READY</div>
              </div>
            </div>

            {/* Float visual widgets */}
            <div className="flex items-center justify-between text-xs text-gray-450 dark:text-zinc-500">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-500" /> Web-SSL Secure</span>
              <span>AES-256 Enabled</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section (Counters) */}
      <section className="bg-white dark:bg-zinc-900 border-y border-gray-100 dark:border-zinc-900 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, i) => (
            <div key={i} className="text-center space-y-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {st.count}
              </span>
              <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-widest">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative text-center">
        <div className="space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">SaaS Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Equipped with Every Transformative Feature
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            A secure engine meticulously constructed to satisfy complex document manipulation requirements seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 rounded-2xl text-left hover:border-indigo-500/50 dark:hover:border-indigo-400/30 hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-gradient-to-tr group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                <feat.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-100 mb-2">{feat.title}</h4>
              <p className="text-xs text-gray-400 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/50 dark:bg-zinc-900/30 border-y border-gray-100 dark:border-zinc-900 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Workspace Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white">
              Transform and Share in Seconds
            </h2>
            <p className="text-sm text-gray-450 dark:text-zinc-400">
              Our lightweight client-side workflow accelerates file conversions without server bottleneck constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            
            {/* Visual connector lines for desktop */}
            <div className="hidden lg:block absolute top-[60px] left-1/4 right-1/4 h-0.5 border-t border-dashed border-gray-200 dark:border-zinc-800 -z-10" />

            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 px-4">
                <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 shadow-md">
                  {st.num}
                </div>
                <h4 className="font-bold text-base text-gray-900 dark:text-zinc-100">{st.title}</h4>
                <p className="text-xs text-gray-450 dark:text-zinc-400 leading-relaxed max-w-xs">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <div className="space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Our Endorsements</span>
          <h2 className="text-3xl font-bold text-gray-950 dark:text-white">Trusted by Creators and Managers</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">See how web builders leverage TransForma for daily optimizations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 rounded-2xl text-left flex flex-col justify-between">
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-bold text-xs text-amber-100 dark:text-zinc-250 truncate">{t.name}</h5>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.rating)].map((_, index) => (
                    <Star key={index} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-zinc-900/20 border-y border-gray-100 dark:border-zinc-900 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-4 max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Cost Transparency</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 dark:text-white">Simple, Affordable Pricing</h2>
            <p className="text-sm text-gray-450 dark:text-zinc-400">Unlock maximum upload files and lightning transformations.</p>
            
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-2 p-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full mt-4">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}
              >
                Monthly Plan
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'}`}
              >
                Yearly Save 25%
                <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase">PROV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((card, idx) => (
              <div 
                key={idx}
                className={`relative bg-white dark:bg-zinc-900 border rounded-3xl p-8 text-left transition-all hover:scale-[1.01] ${
                  card.popular 
                    ? 'border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-100/50 dark:shadow-none' 
                    : 'border-gray-100 dark:border-zinc-800 '
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 rounded-full shadow">
                    Most Popular Choice
                  </span>
                )}
                
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{card.name}</h4>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 min-h-8">{card.desc}</p>
                
                <div className="my-6">
                  <span className="text-3xl font-black text-gray-950 dark:text-white">${card.price}</span>
                  <span className="text-xs text-gray-400 font-medium">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>

                <button
                  onClick={() => navigate('/auth')}
                  className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all ${
                    card.popular 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow' 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-100'
                  }`}
                >
                  {card.cta}
                </button>

                <div className="mt-8 border-t border-gray-50 dark:border-zinc-800 pt-6 space-y-3">
                  {card.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                      <span className="text-xs text-gray-500 dark:text-zinc-450">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 py-16 px-6 relative z-10 text-gray-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="col-span-1 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-sm">
                <RefreshCw className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-zinc-300">
               ThroghtShare
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-gray-400 dark:text-zinc-500">
              The lightweight, secure file and directory manipulator platform designed to compress, convert and securely manage your storage structures.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="font-bold text-xs text-gray-900 dark:text-zinc-200 uppercase tracking-widest">About</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Our Mission</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Team Careers</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Press Inquiries</span></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="font-bold text-xs text-gray-900 dark:text-zinc-200 uppercase tracking-widest">Connect</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Contact Support</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">API Keys</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">System Status</span></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="font-bold text-xs text-gray-900 dark:text-zinc-200 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer transition-colors">GDPR SLA</span></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="font-bold text-xs text-gray-900 dark:text-zinc-200 uppercase tracking-widest">Development</h5>
            <p className="text-[10px] text-gray-400">
              Built with React, Tailwind CSS, and Framer Motion. Powered by client-side browser engines.
            </p>
            <div className="flex gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-zinc-900 hover:bg-indigo-100/50 flex items-center justify-center text-xs text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer font-bold">In</span>
              <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-zinc-900 hover:bg-indigo-100/50 flex items-center justify-center text-xs text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer font-bold">X</span>
              <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-zinc-900 hover:bg-indigo-100/50 flex items-center justify-center text-xs text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer font-bold">Git</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-50 dark:border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 dark:text-zinc-500">
            © 2026 ThroughtShare Inc. All rights reserve-protected. Registered standard workspace application.
          </p>
          <div className="flex gap-4 text-[10px] text-gray-400">
            <span className="hover:underline cursor-pointer">Refund Standard Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
