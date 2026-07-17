import { Link } from 'react-router-dom';
import { topNav, useCases, resources, footerSolutions, legal, YT } from '../data/pages.js';

function Col({ title, items }) {
  return (
    <div>
      <h4 className="text-[0.95rem] font-semibold mb-3">{title}</h4>
      <div className="flex flex-col gap-1">
        {items.map(([t, s]) => (
          <Link key={t + s} to={`/${s}`} className="text-[0.88rem] text-muted hover:text-ink">{t}</Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const company = [
    ['About Us', 'about-us'],
    ['Press', 'press'],
    ['Jobs', 'jobs'],
    ['FAQs', 'faqs'],
    ['Step by Step Guide', 'step-by-step-guide'],
    ['Tutorial Videos', YT],
    ['Contact', 'contact-us'],
  ];
  return (
    <footer className="border-t border-line bg-panel">
      <div className="max-w-[1150px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-5 py-12">
        <Col title="Product" items={[['Home', 'home'], ...topNav, ['Template Partner', 'template-partner'], ['Affiliates', 'affiliate-program']]} />
        <Col title="Use Cases" items={useCases} />
        <Col title="Solutions" items={footerSolutions} />
        <Col title="Company" items={company} />
        <Col title="Legal" items={legal} />
      </div>
      <div className="max-w-[1150px] mx-auto border-t border-line pt-6 pb-8 text-center text-[0.85rem] text-muted">
        &copy; 2026 Core AI Video — coreaivideo.com. All rights reserved.
      </div>
    </footer>
  );
}
