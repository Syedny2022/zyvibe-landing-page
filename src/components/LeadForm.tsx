import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

const LeadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    // Basic client-side email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, source_page: 'hero' }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setStatus('success');
      } else {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error — please check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-6 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-violet-400" strokeWidth={1.5} />
        <p className="text-base font-semibold text-white">You&apos;re in!</p>
        <p className="text-sm text-slate-400">Check your inbox for access details.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition-all text-sm"
          required
          autoComplete="name"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">
          Work Email
        </label>
        <input
          type="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition-all text-sm"
          required
          autoComplete="email"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-premium w-full mt-1 py-3.5 disabled:opacity-50"
        onClick={() => {
          if (typeof window !== 'undefined') {
            const gtag = (window as unknown as { gtag?: (c: string, e: string, p: Record<string,string>) => void }).gtag;
            if (typeof gtag === 'function') {
              gtag('event', 'generate_lead', { method: 'hero_form' });
            }
          }
        }}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            <span>Starting your trial…</span>
          </>
        ) : (
          <>
            <span>Start Free Trial</span>
            <Send className="w-4 h-4" strokeWidth={1.5} />
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-[11px] text-center font-medium">
          {errorMsg || 'Something went wrong. Please try again.'}
        </p>
      )}
      <p className="text-[11px] text-slate-500 text-center pt-1">
        No credit card required.{' '}
        <a href="#" className="underline hover:text-slate-300">
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </form>
  );
};

export default LeadForm;
