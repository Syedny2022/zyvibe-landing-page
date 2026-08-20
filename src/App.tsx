import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  FileSearch,
  Menu,
  Sparkles,
  X,
  Loader2,
  Mail,
  ExternalLink,
} from 'lucide-react';

const APP_URL = 'https://app.zyvibe.com/?utm_source=zyvibe_home&utm_medium=';
const SEO_URL = 'https://seo.zyvibe.com/?utm_source=zyvibe_home&utm_medium=';
const AFFILIATE_URL = 'https://zyvibe.com/affiliates';
const BLOG_URL = 'https://blog.zyvibe.com';
const SUPABASE_URL = 'https://fykcaeuswikyjrjerxns.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXAiLCJyZWYiOiJmeWtjYWV1c3dpa3lyamVyeG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjA5NTksImV4cCI6MjA4OTQ5Njk1OX0.No6HEpwviOZmbZtCrRwTUxDZ4d1tmjDQM-sWU_EKUf4';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const faqs = [
  {
    question: 'What does Zyvibe do?',
    answer:
      'Zyvibe gives solo founders two focused tools: an AI website builder at app.zyvibe.com and an SEO audit product at seo.zyvibe.com. Each is designed to move a launch or optimization task forward quickly.',
  },
  {
    question: 'Which product should I start with?',
    answer:
      'Start with the Website Builder when you need a new page or site. Start with the SEO Auditor when you already have a site and want to identify visibility, architecture, and conversion opportunities.',
  },
  {
    question: 'Do I need an enterprise software stack?',
    answer:
      'No. Zyvibe is positioned for founders and creators who want direct workflows rather than a large collection of disconnected tools.',
  },
  {
    question: 'Where can I find guides and updates?',
    answer:
      'The Zyvibe Playbooks hub at blog.zyvibe.com contains practical resources. You can also join the email list below for product updates and creator-focused workflows.',
  },
  {
    question: 'How can I contact Zyvibe?',
    answer:
      'Email support@zyvibe.co for product help, hello@zyvibe.co for general questions, or press@zyvibe.co for media requests.',
  },
];

function track(eventName: string, parameters: Record<string, string>) {
  if (typeof window === 'undefined') return;

  const gtag = (window as unknown as { gtag?: (command: string, event: string, params: Record<string, string>) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', eventName, parameters);
  }
}

async function addSubscriber(email: string, source: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/email_subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal,resolution=merge-duplicates',
    },
    body: JSON.stringify({
      email,
      source,
      subscribed_at: new Date().toISOString(),
    }),
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`Subscriber request failed with ${response.status}`);
  }
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<SubmitStatus>('idle');
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliateStatus, setAffiliateStatus] = useState<SubmitStatus>('idle');

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('submitting');
    try {
      await addSubscriber(newsletterEmail.trim().toLowerCase(), 'zyvibe-home-newsletter');
      track('newsletter_signup', { source: 'zyvibe_home_footer' });
      setNewsletterEmail('');
      setNewsletterStatus('success');
    } catch {
      setNewsletterStatus('error');
    }
  };

  const handleAffiliateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!affiliateEmail) return;

    setAffiliateStatus('submitting');
    try {
      await addSubscriber(affiliateEmail.trim().toLowerCase(), 'zyvibe-affiliate-interest');
      track('affiliate_interest_signup', { source: 'zyvibe_home_affiliates' });
      setAffiliateEmail('');
      setAffiliateStatus('success');
    } catch {
      setAffiliateStatus('error');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-main text-slate-300 bg-grid-premium">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-bg-main/85 px-5 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a href="https://zyvibe.com" aria-label="Zyvibe home" className="flex items-center gap-2 text-white">
            <span className="text-2xl font-extrabold tracking-[-0.06em]">Zyvibe</span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:flex">
            <a href={`${APP_URL}header`} className="transition-colors hover:text-white">Website Builder</a>
            <a href={`${SEO_URL}header`} className="transition-colors hover:text-white">SEO Auditor</a>
            <a href={BLOG_URL} className="transition-colors hover:text-white">Playbooks</a>
            <a href={AFFILIATE_URL} className="transition-colors hover:text-white">Affiliate Program</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`${AFFILIATE_URL}?utm_source=zyvibe_home&utm_medium=header_cta`}
              className="hidden rounded-lg bg-[#7c3aed] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all hover:bg-[#6d28d9] sm:inline-flex"
            >
              Start Free Today
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
              className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-4 max-w-7xl overflow-hidden border-t border-white/[0.08] lg:hidden"
            >
              <div className="flex flex-col gap-1 py-4 text-sm font-semibold text-slate-300">
                <a href={`${APP_URL}header_mobile`} onClick={closeMobileMenu} className="rounded-lg px-3 py-3 hover:bg-white/[0.05] hover:text-white">Website Builder</a>
                <a href={`${SEO_URL}header_mobile`} onClick={closeMobileMenu} className="rounded-lg px-3 py-3 hover:bg-white/[0.05] hover:text-white">SEO Auditor</a>
                <a href={BLOG_URL} onClick={closeMobileMenu} className="rounded-lg px-3 py-3 hover:bg-white/[0.05] hover:text-white">Playbooks</a>
                <a href={AFFILIATE_URL} onClick={closeMobileMenu} className="rounded-lg px-3 py-3 hover:bg-white/[0.05] hover:text-white">Affiliate Program</a>
                <a href={`${AFFILIATE_URL}?utm_source=zyvibe_home&utm_medium=header_cta_mobile`} onClick={closeMobileMenu} className="mt-2 rounded-lg bg-[#7c3aed] px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-white">Start Free Today</a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative isolate px-5 pb-20 pt-16 md:px-8 md:pb-32 md:pt-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden">
            <div className="absolute left-[6%] top-[-260px] h-[520px] w-[520px] rounded-full bg-[#7c3aed]/20 blur-[120px]" />
            <div className="absolute right-[5%] top-[-230px] h-[480px] w-[480px] rounded-full bg-[#4f46e5]/15 blur-[120px]" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                Built for solo founders &amp; digital creators
              </p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.065em] text-white md:text-7xl lg:text-8xl">
                One Founder. <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Two Engines.</span> 60 Seconds.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Stop wrestling with bloated enterprise tools. Zyvibe is the ultimate platform for indie hackers and social creators. Vibe-code a production-ready website or run a deep-dive SEO revenue audit—each in under 60 seconds.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`${APP_URL}hero_cta`}
                  onClick={() => track('select_content', { content_type: 'product_cta', item_id: 'website_builder_hero' })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_7px_30px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 hover:bg-[#6d28d9]"
                >
                  Build a Site in 60s <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={`${SEO_URL}hero_cta`}
                  onClick={() => track('select_content', { content_type: 'product_cta', item_id: 'seo_audit_hero' })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Audit SEO in 60s <FileSearch className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 text-sm text-slate-500">Choose the engine that removes your next growth bottleneck.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.08 }} className="grid gap-4">
              <div className="bento-card relative overflow-hidden p-7 md:p-8">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Code2 className="h-5 w-5" /></span>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Engine 01</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Website Builder</h2>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">Turn a clear idea into a launch-ready website workflow at app.zyvibe.com.</p>
                  </div>
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200">60s</span>
                </div>
              </div>
              <div className="bento-card relative overflow-hidden p-7 md:p-8">
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
                <div className="relative flex items-start justify-between gap-5">
                  <div>
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300"><FileSearch className="h-5 w-5" /></span>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Engine 02</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">SEO Auditor</h2>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">Find technical, structural, and revenue-focused SEO opportunities at seo.zyvibe.com.</p>
                  </div>
                  <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-bold text-indigo-200">60s</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="website-builder" className="border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="bento-card p-8 md:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Code2 className="h-6 w-6" /></span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Website Builder</p>
              <p className="mt-3 text-5xl font-extrabold tracking-[-0.06em] text-white">60s</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">From concept to an actionable website-building workflow.</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Vibe Code Your Startup in 60 Seconds.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">Don&apos;t let your launch get bogged down by drag-and-drop builders. Describe your vision in plain English, and Zyvibe&apos;s AI instantly generates a live, high-converting landing page.</p>
              <a href={`${APP_URL}website_builder_section`} onClick={() => track('select_content', { content_type: 'product_cta', item_id: 'website_builder_section' })} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition-colors hover:text-white">
                Enter the Builder <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="seo-auditor" className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Audit Your Revenue Leaks in 60 Seconds.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">A fast website is useless if nobody sees it. Instantly reverse-engineer your competitors, spot broken funnels, and optimize your architecture for AI crawlers.</p>
              <a href={`${SEO_URL}seo_auditor_section`} onClick={() => track('select_content', { content_type: 'product_cta', item_id: 'seo_auditor_section' })} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-300 transition-colors hover:text-white">
                Run Your Free Audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="bento-card p-8 md:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300"><FileSearch className="h-6 w-6" /></span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">SEO Auditor</p>
              <p className="mt-3 text-5xl font-extrabold tracking-[-0.06em] text-white">60s</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">A direct starting point for visibility and revenue-focused SEO work.</p>
            </div>
          </div>
        </section>

        <section id="affiliates" className="border-y border-white/[0.07] bg-gradient-to-br from-violet-500/[0.10] via-transparent to-indigo-500/[0.10] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Partner with Zyvibe</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Share tools built for founders who move fast.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">Publish creator, startup, or SEO content? Join the Zyvibe affiliate interest list to receive programme details, launch assets, and partner updates through the existing Zyvibe email workflow.</p>
            </div>
            <div className="bento-card p-7 md:p-8">
              {affiliateStatus === 'success' ? (
                <div className="flex min-h-[190px] flex-col justify-center text-center">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" />
                  <h3 className="mt-4 text-xl font-bold text-white">You&apos;re on the partner list.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">We&apos;ll use this address for Zyvibe affiliate programme updates.</p>
                </div>
              ) : (
                <form onSubmit={handleAffiliateSubmit} className="space-y-4">
                  <label htmlFor="affiliate-email" className="block text-xs font-bold uppercase tracking-[0.16em] text-white">Partner email</label>
                  <input id="affiliate-email" type="email" required value={affiliateEmail} onChange={(event) => setAffiliateEmail(event.target.value)} disabled={affiliateStatus === 'submitting'} placeholder="you@company.com" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60" />
                  {affiliateStatus === 'error' && <p className="text-sm text-red-300">We could not save your request. Please email hello@zyvibe.co instead.</p>}
                  <button type="submit" disabled={affiliateStatus === 'submitting'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-60">
                    {affiliateStatus === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining</> : <>Join the Partner List <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Product questions</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">Frequently Asked Questions</h2>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={faq.question} className="bento-card overflow-hidden">
                    <button type="button" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left text-base font-semibold text-white transition hover:bg-white/[0.03]">
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5 shrink-0 text-violet-300" /> : <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <p className="border-t border-white/[0.06] px-6 py-5 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#09090d] px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="https://zyvibe.com" className="text-2xl font-extrabold tracking-[-0.06em] text-white">Zyvibe</a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">Two focused growth engines for solo developers, creators, and indie founders.</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Products</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><a href={`${APP_URL}footer_cta`} className="transition hover:text-white">Website Builder</a></li>
              <li><a href={`${SEO_URL}footer_cta`} className="transition hover:text-white">SEO Audit</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Ecosystem</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><a href={AFFILIATE_URL} className="transition hover:text-white">Partner / Affiliate Portal</a></li>
              <li><a href={BLOG_URL} className="transition hover:text-white">Read the Blog</a></li>
            </ul>
          </div>
          <div id="newsletter">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Stay in the loop</h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">Get Zyvibe product updates and practical founder playbooks.</p>
            {newsletterStatus === 'success' ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4 shrink-0" /> You&apos;re on the list.</div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-5 space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input id="newsletter-email" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} disabled={newsletterStatus === 'submitting'} placeholder="you@example.com" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60" />
                {newsletterStatus === 'error' && <p className="text-sm text-red-300">We could not save your email. Please try again.</p>}
                <button type="submit" disabled={newsletterStatus === 'submitting'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
                  {newsletterStatus === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining</> : <>Join Now <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-white/[0.06] pt-7 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 Zyvibe. Built for the Solo Developer.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="mailto:hello@zyvibe.co" className="inline-flex items-center gap-1.5 transition hover:text-white"><Mail className="h-3.5 w-3.5" /> hello@zyvibe.co</a>
            <a href="mailto:support@zyvibe.co" className="transition hover:text-white">Support</a>
            <a href="mailto:press@zyvibe.co" className="transition hover:text-white">Press</a>
            <a href={BLOG_URL} className="inline-flex items-center gap-1.5 transition hover:text-white">Playbooks <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
