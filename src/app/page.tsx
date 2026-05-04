import React from 'react';
import Hero from '@/components/landing/Hero';
import CVMorph from '@/components/landing/CVMorph';
import Features from '@/components/landing/Features';
import Logo from '@/components/brand/Logo';
import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-20 z-[100] flex items-center border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container-custom flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={36} />
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">Applynexis</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">How it works</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Login</Link>
            <Link href="/register" className="btn-primary px-6 py-2.5 rounded-xl text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Hero />
        <div id="about">
          <CVMorph />
        </div>
        <div id="features">
          <Features />
        </div>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="container-custom relative z-20 text-center">
            <div className="max-w-3xl mx-auto p-12 rounded-[2.5rem] bg-slate-900 dark:bg-slate-900 text-white shadow-2xl relative overflow-hidden">
              {/* Background gradient blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-32 -mb-32" />

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative z-10">
                Ready to accelerate your career?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
                Join thousands of professionals using Applynexis to automate their job hunt and land more interviews.
              </p>
              <Link href="/register" className="btn-primary text-lg px-10 py-4 rounded-2xl relative z-10">
                Join Applynexis Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="container-custom flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={32} />
              <span className="font-bold text-xl tracking-tight">Applynexis</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering job seekers with AI-driven tools to track, manage, and win their next career move.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                <span className="font-bold text-xs">𝕏</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                <span className="font-bold text-xs">in</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Scraper</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container-custom mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
          © 2026 Applynexis AI. Engineered for excellence.
        </div>
      </footer>
    </div>
  );
}
