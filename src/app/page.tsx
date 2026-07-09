'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileCheck, Brain, Shield, LineChart } from 'lucide-react'

const Hero3D = dynamic(() => import('@/components/marketing/hero-3d'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-xl sticky top-0 z-50 bg-slate-950/70">
        <div className="text-2xl font-bold tracking-tighter text-emerald-400 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-400 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>
          Fatoora AI
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="/features" className="hover:text-emerald-400 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
          <Link href="/e-invoicing-readiness" className="hover:text-emerald-400 transition-colors">E-Invoicing</Link>
          <Link href="/security" className="hover:text-emerald-400 transition-colors">Security</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold border-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32 flex items-center justify-center min-h-[85vh]">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-emerald-900/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container relative z-10 mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl animate-slide-up">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                UAE E-Invoicing Ready 2026
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
                UAE Invoicing & Finance, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">Automated.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
                The intelligent VAT-ready platform for UAE SMEs and freelancers. 
                Generate invoices, extract expenses with AI, and prepare for upcoming e-invoicing mandates seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-lg px-8 h-14 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/e-invoicing-readiness">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8">
                    Check Readiness
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
                <Shield className="h-4 w-4" /> No credit card required. Cancel anytime.
              </p>
            </div>
            <div className="hidden md:block relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {/* Floating UI Elements instead of 3D Hero */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full filter blur-[80px]" />
                
                {/* Main Dashboard Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] glass-panel rounded-2xl p-6 border border-slate-700/50 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-slate-700 rounded" />
                      <div className="h-4 w-32 bg-slate-600 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">
                      Paid
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-12 w-full bg-slate-800/50 rounded flex items-center justify-between px-4">
                      <div className="h-2 w-20 bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-600 rounded" />
                    </div>
                    <div className="h-12 w-full bg-slate-800/50 rounded flex items-center justify-between px-4">
                      <div className="h-2 w-20 bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-600 rounded" />
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className="absolute -right-12 top-1/4 glass-card rounded-xl p-4 shadow-xl border border-slate-700/50 animate-[slideUp_3s_ease-in-out_infinite_alternate]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <FileCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Invoice #1042</div>
                      <div className="text-xs text-slate-400">Sent to Gulf Trading LLC</div>
                    </div>
                  </div>
                </div>

                {/* Floating Chart */}
                <div className="absolute -left-8 bottom-1/4 glass-card rounded-xl p-4 shadow-xl border border-slate-700/50 animate-[slideUp_4s_ease-in-out_infinite_alternate-reverse]">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-slate-300">Net VAT</span>
                  </div>
                  <div className="text-lg font-bold text-white">AED 4,500</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Banner */}
        <section className="border-y border-slate-800/60 bg-slate-950/50 py-10 overflow-hidden">
          <div className="container mx-auto px-6">
            <p className="text-center text-sm font-medium text-slate-500 mb-6 tracking-widest uppercase">Trusted by forward-thinking UAE businesses</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-bold font-serif">Al Futtaim Logistics</div>
              <div className="text-xl font-bold tracking-tighter">GulfTech Solutions</div>
              <div className="text-xl font-bold uppercase tracking-widest">Emaar Partners</div>
              <div className="text-xl font-bold italic">Dubai Design Hub</div>
              <div className="text-xl font-bold">Oasis Trading LLC</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 bg-slate-900/50 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Everything you need to run your UAE business</h2>
              <p className="text-lg text-slate-400">Built specifically for the UAE market with FTA compliance and local business practices in mind.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 group">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileCheck className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">VAT-Ready Invoicing</h3>
                <p className="text-slate-400 leading-relaxed">Create beautiful, compliant invoices with built-in UAE VAT treatments (Standard 5%, Zero-Rated, Exempt).</p>
              </div>
              <div className="glass-card p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 group">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI Expense Extraction</h3>
                <p className="text-slate-400 leading-relaxed">Upload receipts and let AI extract the TRN, amounts, and VAT automatically. Review and approve in seconds.</p>
              </div>
              <div className="glass-card p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 group">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LineChart className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Cash Flow & VAT Estimates</h3>
                <p className="text-slate-400 leading-relaxed">Track outstanding invoices, predict 30-day cash flow, and generate estimated VAT summaries for your accountant.</p>
              </div>
            </div>
          </div>
        </section>

        {/* E-Invoicing Callout */}
        <section className="py-32 bg-slate-950 border-t border-slate-800/60 relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="glass-panel border border-emerald-500/30 rounded-[2.5rem] p-10 md:p-16 text-center max-w-5xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
              <Shield className="h-16 w-16 text-emerald-400 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready for UAE E-Invoicing?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                The UAE Ministry of Finance is rolling out mandatory B2B e-invoicing. Fatoora AI includes a readiness scoring system and structured data exports to prepare you for Accredited Service Provider (ASP) integration.
              </p>
              <Link href="/e-invoicing-readiness">
                <Button className="bg-white text-slate-950 hover:bg-slate-200 h-14 px-8 text-lg font-bold">View Readiness Guide</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60 py-12 px-6 bg-slate-950">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-6">
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-[2px]" />
            </span>
            © 2026 Fatoora AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>
          <div className="text-center md:text-right max-w-xl text-xs leading-relaxed space-y-1">
            <p>VAT estimate only. Not official tax filing. Review with your accountant.</p>
            <p>Structured export only. Not an official FTA submission.</p>
            <p>Fatoora AI is ASP-integration-ready, but this demo does not connect to an Accredited Service Provider.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
