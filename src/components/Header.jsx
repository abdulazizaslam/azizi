import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_LOGIN, APP_REGISTER, topNav, useCases, resources } from '../data/pages.js';

function Dropdown({ label, items }) {
  return (
    <li className="has-dropdown relative">
      <button className="navlink flex items-center gap-1 text-[0.92rem] text-muted px-3 py-2 rounded-lg hover:text-ink hover:bg-panel transition">
        {label} <span className="text-[0.7rem]">▾</span>
      </button>
      <div className="dropdown hidden flex-col absolute top-full left-0 min-w-[240px] bg-panel border border-line rounded-xl p-2 shadow-2xl z-50">
        {items.map(([t, s]) => (
          <Link
            key={s}
            to={`/${s}`}
            className="text-[0.9rem] text-muted px-3 py-2 rounded-lg hover:text-ink hover:bg-panel2"
          >
            {t}
          </Link>
        ))}
      </div>
    </li>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/85 border-b border-line">
      <div className="flex items-center gap-6 px-5 py-3">
        <Link to="/" className="logo text-xl font-extrabold grad-text whitespace-nowrap">Core AI Video</Link>
        <button
          className="md:hidden text-2xl text-ink ml-auto"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >☰</button>
        <nav className={`main-nav ${open ? 'block' : 'hidden'} md:flex flex-1`}>
          <ul className="flex md:flex-row flex-col md:items-center gap-1">
            {topNav.map(([t, s]) => (
              <li key={s}>
                <Link to={`/${s}`} className="navlink block text-[0.92rem] text-muted px-3 py-2 rounded-lg hover:text-ink hover:bg-panel transition">{t}</Link>
              </li>
            ))}
            <Dropdown label="Use Cases" items={useCases} />
            <Dropdown label="Resources" items={resources} />
          </ul>
        </nav>
        <div className={`nav-cta ${open ? 'flex' : 'hidden'} md:flex gap-2 items-center`}>
          <a href={APP_LOGIN} target="_blank" rel="noopener" className="btn btn-ghost border border-line text-ink px-4 py-2 rounded-full text-[0.92rem] font-semibold hover:bg-panel transition">Sign In</a>
          <a href={APP_REGISTER} target="_blank" rel="noopener" className="btn btn-primary grad-bg text-white px-4 py-2 rounded-full text-[0.92rem] font-semibold hover:-translate-y-0.5 transition">Start Free Trial</a>
        </div>
      </div>
    </header>
  );
}
