import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Lock, BarChart3, Calendar, Users, MessageSquare, LogOut, User, Menu, X, Linkedin, Twitter, Instagram, Youtube, ChevronDown, ChevronUp, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import DashboardUI from './components/DashboardUI';
import VoiceAssistant from './components/VoiceAssistant';
import SchedulingWidget from './components/SchedulingWidget';

const FAQS = [
  {
    q: "What is Zyvibe?",
    a: "Zyvibe is an AI-powered business automation platform that connects your content creation, affiliate marketing, scheduling, and workflow management into one intelligent engine."
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Zyvibe offers a free Starter plan with core automation features. Upgrade to Pro or Enterprise for advanced AI agents, unlimited workflows, and priority support."
  },
  {
    q: "How does the AI automation work?",
    a: "Zyvibe uses AI agents that learn your business patterns and automatically execute tasks — from posting content at optimal times to routing leads and managing your revenue streams."
  },
  {
    q: "Can I connect my social media accounts?",
    a: "Yes. Zyvibe integrates with Twitter/X, Instagram, LinkedIn, YouTube, Facebook, and more through our secure OAuth connection system."
  },
  {
    q: "How do I get support?",
    a: "Email us at support@zyvibe.com or reach us on Twitter @ZyvibeHQ. Pro and Enterprise users get priority 24/7 support via live chat."
  }
];

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setContactName(user.displayName || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactStatus('submitting');
    try {
      await addDoc(collection(db, 'contacts'), {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        createdAt: new Date().toISOString(),
        userId: user?.uid || 'anonymous'
      });
      setContactStatus('success');
      setContactMessage('');
      setTimeout(() => setContactStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setContactStatus('error');
    }
  };
  return (
    <div className="min-h-screen bg-bg-main text-slate-400 overflow-x-hidden bg-grid-premium relative">
      {/* Light Leaks */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.15, 0.2],
            scale: [1, 1.1, 1.05, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] light-leak-left opacity-20" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.15, 0.2, 0.1, 0.15],
            scale: [1.1, 1, 1.05, 1.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] light-leak-right opacity-20" 
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 z-[9999] px-6 py-4 bg-bg-main/60 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold tracking-tightest text-white">Zyvibe</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="#" aria-label="Product Page" className="hover:text-white transition-colors">Product</a>
            <a href="#" aria-label="Solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" aria-label="Pricing Plans" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" aria-label="About Us" className="hover:text-white transition-colors">About</a>
            <a href="#" aria-label="Contact Us" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Auth Panel */}
            <div className="hidden md:flex items-center gap-4">
              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full border border-white/20" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center">
                          <User className="w-3 h-3 text-brand-purple" />
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate max-w-[80px]">
                        {user.displayName?.split(' ')[0]}
                      </span>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      aria-label="Sign Out"
                      className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-4"
                  >
                    <button 
                      onClick={handleSignIn}
                      aria-label="Sign In"
                      className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white border border-white/10 px-4 py-2 rounded-lg bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={handleSignIn}
                      aria-label="Get Started"
                      className="bg-[#7c3aed] text-white text-[11px] font-bold uppercase tracking-[0.1em] py-2 px-4 rounded-lg hover:bg-[#6d28d9] transition-all cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
                    >
                      Get Started
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden absolute top-full left-0 right-0 bg-bg-main/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden z-40"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4 text-sm font-semibold tracking-wider text-slate-300">
                  <a href="#" aria-label="Product Page" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Product</a>
                  <a href="#" aria-label="Solutions" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Solutions</a>
                  <a href="#" aria-label="Pricing Plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">Pricing</a>
                  <a href="#" aria-label="About Us" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/5">About</a>
                  <a href="#" aria-label="Contact Us" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-2">Contact</a>
                </div>
                
                {/* Mobile Authentication Area */}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-white/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-brand-purple" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {user.displayName}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        aria-label="Sign Out"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          handleSignIn();
                          setMobileMenuOpen(false);
                        }}
                        aria-label="Sign In via Google"
                        className="w-full text-center py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => {
                          handleSignIn();
                          setMobileMenuOpen(false);
                        }}
                        aria-label="Get Started"
                        className="w-full text-center py-2.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-xs font-bold uppercase tracking-widest text-white transition-all cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-[0.3em] mb-10">
              <Sparkles className="w-3 h-3" />
              Financial Grade Infrastructure
            </div>
            
            <h1 className="text-[clamp(2rem,8vw,3.5rem)] md:text-7xl lg:text-8xl font-extrabold leading-[1.0] text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] mb-8 tracking-tightest">
              The Operating System for Modern Creators
            </h1>

            <h2 className="text-base leading-[1.6] md:text-xl font-light text-[#a1a1aa] max-w-[640px] mb-12 md:leading-relaxed">
              Consolidate your creative workflow. Zyvibe provides professional-grade tools to optimize audience routing, automate content queues, and manage subscription revenue with absolute precision.
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-12 w-full">
              <button 
                onClick={handleSignIn}
                className="w-full md:w-auto bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-lg hover:bg-[#6d28d9] transition-all cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                aria-label="Start Free Today"
              >
                Start Free Today
              </button>
              <button 
                className="w-full md:w-auto border border-white/10 bg-white/[0.02] hover:bg-white/5 text-white text-xs font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-lg transition-colors cursor-pointer"
                aria-label="Watch Demo"
              >
                Watch Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 mb-12">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-white" strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-white" strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">256-bit AES</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Preview */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2"
            >
              <DashboardUI className="shadow-2xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-2"
            >
              <SchedulingWidget className="shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5 text-left">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              About Zyvibe
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tightest">
              Built for Creators Who Mean Business
            </h2>
            <div className="space-y-6 text-base text-slate-400 font-medium leading-relaxed">
              <p>
                Zyvibe is an AI-powered business automation platform built specifically to support creators, solopreneurs, and small businesses. We provide the technical leverage needed to automate complex operational workflows, optimize audience growth, and streamline monetization pathways so you can successfully compete at enterprise scale.
              </p>
              <p>
                Founded on the core belief that powerful, production-grade business tools should be readily accessible to everyone, Zyvibe integrates fragmenting platform tasks into a cohesive, secure operating system. We take care of operational overhead, enabling you to focus entirely on outstanding creative output and strategic business expansion.
              </p>
            </div>
          </div>

          {/* 3-stat Bento Row / Grid */}
          <div className="grid gap-6 text-left">
            <div className="p-8 bento-card relative overflow-hidden group hover:bg-white/[0.03]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
              <p className="text-5xl font-extrabold text-[#7c3aed] mb-2 tracking-tightest">10K+</p>
              <p className="text-lg font-bold text-white mb-1 tracking-tight">Automations Run</p>
              <p className="text-xs text-slate-500">Intelligent flows executed flawlessly across global networks.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bento-card relative overflow-hidden group hover:bg-white/[0.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-indigo/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-4xl font-extrabold text-[#4f46e5] mb-2 tracking-tightest">500+</p>
                <p className="text-sm font-bold text-white mb-1 tracking-tight">Creators Powered</p>
                <p className="text-[11px] text-slate-500">Empowering digital business owners worldwide.</p>
              </div>
              
              <div className="p-8 bento-card relative overflow-hidden group hover:bg-white/[0.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-4xl font-extrabold text-white mb-2 tracking-tightest">99.9%</p>
                <p className="text-sm font-bold text-white mb-1 tracking-tight">Uptime</p>
                <p className="text-[11px] text-slate-500">Robust, reliable financial grade operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5 relative z-10 text-left">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              Support Center
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tightest">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-400 font-medium">
              Everything you need to know about our business automation engine.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i}
                  className="bento-card border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={`Toggle description for ${faq.q}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold hover:bg-white/[0.01] transition-colors cursor-pointer"
                  >
                    <span className="text-sm md:text-base tracking-tight">{faq.q}</span>
                    <span className="text-slate-500 ml-4 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-brand-purple" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-400 font-medium leading-relaxed border-t border-white/5 pt-4 bg-white/[0.003]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-32 px-6 bg-white/[0.002] border-b border-white/5 relative z-10 text-left">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              Contact Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tightest">
              Get In Touch
            </h2>
            <p className="text-base text-slate-400 font-medium">
              Have a question or want to partner? We reply within 24 hours.
            </p>
          </div>

          <div className="bento-card p-8 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {contactStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you! Your message has been sent successfully. Our team will contact you shortly.</span>
                </motion.div>
              )}
              {contactStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                >
                  <X className="w-5 h-5 shrink-0 text-red-400" />
                  <span>An error occurred while sending your message. Please try again.</span>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    disabled={contactStatus === 'submitting'}
                    className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#7c3aed]/50 transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    disabled={contactStatus === 'submitting'}
                    className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#7c3aed]/50 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us about your creator business, workflows, or any inquiries..."
                  disabled={contactStatus === 'submitting'}
                  className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#7c3aed]/50 transition-colors disabled:opacity-50 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus === 'submitting'}
                className="w-full py-4 rounded-lg bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#6d28d9] transition-all cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {contactStatus === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <a href="mailto:support@zyvibe.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-purple" />
                <span>support@zyvibe.com</span>
              </a>
              <a href="https://twitter.com/ZyvibeHQ" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-all">
                <Twitter className="w-4 h-4 text-brand-purple" />
                <span>@ZyvibeHQ</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Assistant Section */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">
            AI Consultation Engine
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tightest">
            Automate your <span className="text-gradient">strategic growth.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-16 max-w-2xl mx-auto font-medium">
            Our AI-driven consultation engine analyzes your creative bottlenecks in real-time. Speak to Zyvibe to receive a tailored scaling roadmap.
          </p>
          
          <VoiceAssistant />
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Global Infrastructure", desc: "Deploy your content across 40+ edge locations for sub-second delivery to your audience." },
            { icon: ShieldCheck, title: "Enterprise Security", desc: "Financial-grade encryption and multi-factor authentication protect your creative assets." },
            { icon: Zap, title: "Real-time Sync", desc: "Proprietary WebSocket engine ensures your dashboard is always in sync with your live metrics." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-10 bento-card group hover:bg-white/[0.04]"
            >
              <div className="w-12 h-12 bg-white/[0.03] rounded-lg flex items-center justify-center mb-8 border border-white/10 group-hover:border-brand-purple/50 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-purple" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tightest">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/[0.06] bg-[#0a0a0f] relative z-10 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-xl font-bold tracking-tightest text-white">Zyvibe</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                The AI engine behind your business.
              </p>
              <div className="flex gap-4">
                <a href="#" aria-label="X (formerly Twitter)" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Product</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-400 font-medium">
                <li><a href="#" aria-label="Features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" aria-label="Pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" aria-label="API Docs" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" aria-label="Status Page" className="hover:text-white transition-colors">Status Page</a></li>
                <li><a href="#" aria-label="Changelog" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Company</h4>
              <ul className="flex flex-col gap-4 text-sm text-slate-400 font-medium">
                <li><a href="#" aria-label="About Us" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" aria-label="Blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" aria-label="Careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" aria-label="Press" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" aria-label="Contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Stay in the loop</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Get AI automation tips and product updates weekly.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  aria-label="Email address for updates"
                  required
                  className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#7c3aed]/50 transition-colors"
                />
                <button 
                  type="submit" 
                  aria-label="Join newsletter"
                  className="w-full py-2.5 rounded-lg bg-[#7c3aed] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#6d28d9] transition-all cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
                >
                  Join Now
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest">
              © 2025 Zyvibe Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-slate-600 font-bold uppercase tracking-widest">
              <a href="#" aria-label="Terms of Service" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" aria-label="Privacy Policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" aria-label="Cookie Policy" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
