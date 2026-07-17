import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Page from './Page.jsx';
import { pages, APP_REGISTER } from '../data/pages.js';

export default function Layout() {
  const { pathname } = useLocation();
  const slug = pathname === '/' ? 'home' : pathname.slice(1);
  const data = pages[slug] || pages.home;

  // Scroll to top on route change.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const isHome = slug === 'home';
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className={`text-center px-5 ${isHome ? 'pt-28 pb-16' : 'pt-20 pb-12'} bg-[radial-gradient(ellipse_at_top,rgba(108,140,255,0.13),transparent_60%)]`}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{data.title}</h1>
          <p className="text-muted text-lg md:text-xl max-w-[680px] mx-auto mb-8">{data.subtitle}</p>
          <a href={APP_REGISTER} target="_blank" rel="noopener" className="btn btn-primary grad-bg text-white px-6 py-3 rounded-full text-lg font-semibold hover:-translate-y-0.5 transition inline-block">
            {isHome ? 'Start Free Trial' : 'Get Started'}
          </a>
        </section>
        <Page data={data} />
        <section className="text-center px-5 py-16 mt-8 bg-gradient-to-b from-transparent to-[rgba(108,140,255,0.08)] border-t border-line">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to launch your AI video brand?</h2>
          <a href={APP_REGISTER} target="_blank" rel="noopener" className="btn btn-primary grad-bg text-white px-6 py-3 rounded-full text-lg font-semibold hover:-translate-y-0.5 transition inline-block">Start Free Trial</a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
