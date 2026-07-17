import { APP_REGISTER } from '../data/pages.js';

function Section({ sec }) {
  if (sec.cards) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {sec.cards.map(([h, p]) => (
          <div key={h} className="bg-panel border border-line rounded-2xl p-7">
            <h3 className="text-xl font-semibold mb-2">{h}</h3>
            <p className="text-muted">{p}</p>
          </div>
        ))}
      </div>
    );
  }
  if (sec.pricing) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {sec.pricing.map(([name, price, feats]) => (
          <div key={name} className="bg-panel border border-line rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold">{name}</h3>
            <div className="text-3xl font-extrabold my-3 grad-text">{price}</div>
            <ul className="flex flex-col gap-2 mb-6">
              {feats.map((f) => <li key={f} className="text-muted">{f}</li>)}
            </ul>
            <a href={APP_REGISTER} target="_blank" rel="noopener" className="btn btn-primary grad-bg text-white px-5 py-2 rounded-full font-semibold">Choose {name}</a>
          </div>
        ))}
      </div>
    );
  }
  if (sec.faq) {
    return (
      <div className="flex flex-col gap-3 max-w-[760px]">
        {sec.faq.map(([q, a]) => (
          <details key={q} className="bg-panel border border-line rounded-xl p-4">
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="text-muted mt-2">{a}</p>
          </details>
        ))}
      </div>
    );
  }
  if (sec.contact) {
    return (
      <form className="flex flex-col gap-3 max-w-[480px]" onSubmit={(e) => { e.preventDefault(); alert('This is a demo form.'); }}>
        <input required placeholder="Your name" className="bg-panel border border-line rounded-xl px-4 py-3 text-ink outline-none focus:border-accent" />
        <input required type="email" placeholder="Your email" className="bg-panel border border-line rounded-xl px-4 py-3 text-ink outline-none focus:border-accent" />
        <textarea required rows="5" placeholder="Your message" className="bg-panel border border-line rounded-xl px-4 py-3 text-ink outline-none focus:border-accent" />
        <button type="submit" className="btn btn-primary grad-bg text-white px-5 py-3 rounded-full font-semibold self-start">Send Message</button>
      </form>
    );
  }
  return (
    <div className="mb-10">
      {sec.h && <h2 className="text-2xl font-semibold mb-3">{sec.h}</h2>}
      {sec.p && <p className="text-muted text-[1.05rem] max-w-[760px]">{sec.p}</p>}
      {sec.list && (
        <ul className="mt-4 grid gap-2">
          {sec.list.map((i) => (
            <li key={i} className="text-muted pl-7 relative">
              <span className="absolute left-0 text-accent font-bold">✓</span>{i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Page({ data }) {
  return (
    <div className="max-w-[1150px] mx-auto px-5 py-8">
      {data.sections.map((sec, i) => <Section key={i} sec={sec} />)}
    </div>
  );
}
