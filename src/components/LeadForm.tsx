import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const LeadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await addDoc(collection(db, 'leads'), {
        name,
        email,
        source: 'form',
        createdAt: new Date().toISOString(),
      });
      setStatus('success');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding lead:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" strokeWidth={1.5} />
        <h3 className="text-lg font-bold text-white mb-1 tracking-tightest">Welcome to Zyvibe</h3>
        <p className="text-sm text-slate-400">Your professional workspace is ready.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
        <input
          type="email"
          placeholder="john@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-premium w-full mt-2 disabled:opacity-50"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Start Free Trial</span>
            <Send className="w-4 h-4" strokeWidth={1.5} />
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-[11px] text-center font-medium">An error occurred. Please try again.</p>
      )}
      <p className="text-[11px] text-slate-500 text-center mt-4">
        By signing up, you agree to our <a href="#" className="underline hover:text-slate-300">Terms of Service</a>.
      </p>
    </form>
  );
};

export default LeadForm;
