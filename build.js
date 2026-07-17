// Static site generator for the CoreAIVideo clone.
// Recreates the coreaivideo.com menu structure as flat, cross-linked HTML pages.
// Run: node build.js
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const SITE = 'Core AI Video';
const APP_LOGIN = 'https://app.coreaivideo.com/login';
const APP_REGISTER = 'https://app.coreaivideo.com/register';
const YT = 'https://www.youtube.com/playlist?list=PLheyCS9C8Lvik7TXnMN3ziy-Jau2loCZE';

// ---- Menu definition (label -> slug). External links use full URL. ----
const useCases = [
  ['Brand-Owned AI Influencer', 'brand-owned-ai-influencer'],
  ['Influencer Agencies', 'influencer-agencies'],
  ['Influencers', 'influencers'],
  ['LinkedIn Personal Branding', 'linkedin-personal-branding'],
  ['LinkedIn Agency', 'linkedin-agency'],
  ['Creators', 'creators'],
  ['Podcast Style Videos', 'podcast-style-videos'],
  ['News Videos', 'news-videos'],
  ['AI UGC Videos', 'ai-ugc-videos'],
  ['AI Video Ads', 'ai-video-ads'],
];
const resources = [
  ['What is AI Influencer', 'what-is-ai-influencer'],
  ['Why CoreAIVideo', 'why-coreaivideo-is-different'],
  ['CoreAIVideo Workflow', 'coreaivideo-workflow'],
  ['Tutorial Videos', YT],
  ['Step-by-Step Guide', 'step-by-step-guide'],
  ['FAQs', 'faqs'],
  ['Jobs', 'jobs'],
  ['About Us', 'about-us'],
  ['Press', 'press'],
  ['Affiliate Partner', 'affiliate-program'],
  ['Contact', 'contact-us'],
];
// Footer-only extras
const footerExtra = [
  ['Social Media Agencies', 'social-media-agencies'],
  ['Personal Branding for Teams', 'personal-branding-for-teams'],
  ['Product Explainer', 'product-explainers'],
  ['Real Estate Marketing', 'real-estate-video-content-platform'],
  ['SaaS Marketing', 'saas-video-content-marketing'],
  ['Personalized Sales Pitches', 'personalized-sales-pitches'],
  ['Template Partner', 'template-partner'],
];
const legal = [
  ['Privacy Policy', 'privacy-policy'],
  ['AI Governance', 'ai-governance'],
  ['Terms and Conditions', 'terms-and-conditions'],
  ['Imprint', 'imprint'],
];
const topLevel = [
  ['Done-for-You', 'done-for-you-video'],
  ['Agency Partner Program', 'agency-partner-program'],
  ['Pricing', 'pricing'],
];

function href(slug) {
  if (/^https?:\/\//.test(slug)) return slug;
  return slug + '.html';
}
function ext(slug) { return /^https?:\/\//.test(slug); }

// ---- Per-page content (headline, subtitle, sections[]) ----
// Sections: {h, p} or {h, list:[]}
const PAGES = {
  'index': {
    title: 'Launch Your Own AI Influencer',
    subtitle: 'Build a video brand as a system — not video by video. Core AI Video turns your ideas into a consistent stream of AI-generated content.',
    hero: true,
    sections: [
      { h: 'Run video as a system', p: 'Stop starting from scratch every time. Define your character, voice, and style once, then generate on-brand videos on demand.' },
      { h: 'One workflow, endless output', p: 'Script, generate, and publish AI videos for ads, social, and personal branding — all from a single streamlined pipeline.' },
      { cards: [
        ['⚡ Fast', 'Go from prompt to finished video in minutes.'],
        ['🎬 Consistent', 'A reusable AI persona keeps every video on-brand.'],
        ['💸 Affordable', 'Cut production costs without cutting quality.'],
      ]},
    ],
  },
  'done-for-you-video': { title: 'Done-for-You Video', subtitle: 'We plan, script, and produce your AI videos so you can focus on your business.', sections: [
    { h: 'Fully managed production', p: 'Our team handles strategy, scripting, generation, and editing end to end. You review and approve.' },
    { h: 'What you get', list: ['A dedicated content strategist', 'Custom AI persona setup', 'A steady pipeline of ready-to-post videos', 'Revisions until it is right'] },
  ]},
  'agency-partner-program': { title: 'Agency Partner Program', subtitle: 'Offer AI video at scale to your clients with wholesale pricing and white-label options.', sections: [
    { h: 'Grow your agency', p: 'Add a high-margin AI video service without hiring a production team.' },
    { h: 'Partner benefits', list: ['Volume discounts', 'White-label delivery', 'Priority support', 'Co-marketing opportunities'] },
  ]},
  'pricing': { title: 'Pricing', subtitle: 'Simple plans that scale with your video output.', sections: [
    { pricing: [
      ['Starter', '$29/mo', ['20 AI videos / month', '1 AI persona', 'Standard rendering', 'Email support']],
      ['Growth', '$99/mo', ['100 AI videos / month', '5 AI personas', 'Priority rendering', 'Chat support']],
      ['Scale', 'Custom', ['Unlimited videos', 'Unlimited personas', 'Dedicated manager', 'API access']],
    ]},
  ]},
  // Use cases
  'brand-owned-ai-influencer': { title: 'Brand-Owned AI Influencer', subtitle: 'Own a virtual spokesperson that never sleeps and always stays on message.', sections: [
    { h: 'Your face of the brand', p: 'Create a custom AI influencer that represents your brand across every channel.' },
    { h: 'Why brands love it', list: ['Full ownership and control', 'Consistent messaging', 'No scheduling or talent fees', 'Scales to any language'] },
  ]},
  'influencer-agencies': { title: 'For Influencer Agencies', subtitle: 'Scale your roster with AI-powered talent and content.', sections: [
    { h: 'More clients, less overhead', p: 'Produce content for many creators from one platform.' },
  ]},
  'influencers': { title: 'For Influencers', subtitle: 'Post more, film less. Clone your style with AI video.', sections: [
    { h: 'Never miss a posting day', p: 'Generate on-brand videos even when you are off-camera.' },
  ]},
  'linkedin-personal-branding': { title: 'LinkedIn Personal Branding', subtitle: 'Show up consistently on LinkedIn with AI-generated thought-leadership videos.', sections: [
    { h: 'Build authority', p: 'Turn your ideas into polished talking-head videos that grow your audience.' },
  ]},
  'linkedin-agency': { title: 'LinkedIn Agency', subtitle: 'Manage LinkedIn video for multiple executives at scale.', sections: [
    { h: 'Executive ghost-production', p: 'Deliver a steady stream of branded videos for every client leader.' },
  ]},
  'creators': { title: 'For Creators', subtitle: 'Multiply your output without burning out.', sections: [
    { h: 'Create at the speed of ideas', p: 'Repurpose one idea into many formats automatically.' },
  ]},
  'podcast-style-videos': { title: 'Podcast Style Videos', subtitle: 'Turn conversations into engaging AI-hosted podcast videos.', sections: [
    { h: 'Studio look, zero studio', p: 'Generate multi-speaker podcast-style videos from a script.' },
  ]},
  'news-videos': { title: 'News Videos', subtitle: 'Publish timely, AI-presented news clips daily.', sections: [
    { h: 'Always on the story', p: 'Produce anchor-style news videos from headlines in minutes.' },
  ]},
  'ai-ugc-videos': { title: 'AI UGC Videos', subtitle: 'Authentic, user-generated-style ads at scale.', sections: [
    { h: 'UGC that converts', p: 'Generate relatable, on-trend UGC videos for your products.' },
  ]},
  'ai-video-ads': { title: 'AI Video Ads', subtitle: 'Launch and test dozens of ad variations without a film crew.', sections: [
    { h: 'Test more, spend less', p: 'Spin up ad creative variations to find winners faster.' },
  ]},
  // Resources
  'what-is-ai-influencer': { title: 'What is an AI Influencer?', subtitle: 'A guide to virtual, AI-generated personalities and how brands use them.', sections: [
    { h: 'Definition', p: 'An AI influencer is a computer-generated persona that creates content and engages audiences like a human creator.' },
  ]},
  'why-coreaivideo-is-different': { title: 'Why Core AI Video is Different', subtitle: 'Systemized video creation, not one-off clips.', sections: [
    { h: 'A system, not a tool', p: 'We focus on repeatable pipelines so your output stays consistent and on-brand.' },
  ]},
  'coreaivideo-workflow': { title: 'The Core AI Video Workflow', subtitle: 'From idea to published video in four steps.', sections: [
    { h: 'How it works', list: ['1. Define your persona', '2. Write or generate a script', '3. Render your video', '4. Publish everywhere'] },
  ]},
  'step-by-step-guide': { title: 'Step-by-Step Guide', subtitle: 'Everything you need to create your first AI video.', sections: [
    { h: 'Getting started', list: ['Create your account', 'Set up your first persona', 'Generate a test video', 'Share and iterate'] },
  ]},
  'faqs': { title: 'Frequently Asked Questions', subtitle: 'Answers to the most common questions.', sections: [
    { faq: [
      ['Do I need editing skills?', 'No. Core AI Video handles generation and editing for you.'],
      ['Can I use my own script?', 'Yes, paste your script or let the AI write one.'],
      ['Is the persona reusable?', 'Absolutely — set it once and reuse it forever.'],
    ]},
  ]},
  'jobs': { title: 'Jobs', subtitle: 'Join the team building the future of video.', sections: [
    { h: 'Open roles', p: 'We are always looking for talented people. Reach out via our contact page.' },
  ]},
  'about-us': { title: 'About Us', subtitle: 'We help anyone launch a video brand with AI.', sections: [
    { h: 'Our mission', p: 'Make consistent, high-quality video creation accessible to everyone.' },
  ]},
  'press': { title: 'Press', subtitle: 'News and media resources.', sections: [
    { h: 'Media inquiries', p: 'For press requests, contact us and we will get back to you promptly.' },
  ]},
  'affiliate-program': { title: 'Affiliate Program', subtitle: 'Earn recurring commission by referring Core AI Video.', sections: [
    { h: 'Partner with us', p: 'Share your link and earn for every customer you bring.' },
  ]},
  'contact-us': { title: 'Contact Us', subtitle: 'We would love to hear from you.', sections: [
    { contact: true },
  ]},
  // Footer extras
  'social-media-agencies': { title: 'Social Media Agencies', subtitle: 'Deliver more content for every client with AI video.', sections: [
    { h: 'Scale your deliverables', p: 'Produce consistent branded video across all your accounts.' },
  ]},
  'personal-branding-for-teams': { title: 'Personal Branding for Teams', subtitle: 'Equip your whole team to show up on camera — with AI.', sections: [
    { h: 'Team-wide presence', p: 'Give every team member a polished on-brand video presence.' },
  ]},
  'product-explainers': { title: 'Product Explainer Videos', subtitle: 'Explain your product clearly with AI-generated videos.', sections: [
    { h: 'Clarity that converts', p: 'Turn features into easy-to-follow explainer videos.' },
  ]},
  'real-estate-video-content-platform': { title: 'Real Estate Marketing', subtitle: 'AI video content for listings and agents.', sections: [
    { h: 'Sell faster with video', p: 'Generate listing walkthroughs and agent branding videos.' },
  ]},
  'saas-video-content-marketing': { title: 'SaaS Marketing', subtitle: 'Content-driven video marketing for SaaS.', sections: [
    { h: 'Grow your pipeline', p: 'Produce demos, explainers, and ads that drive signups.' },
  ]},
  'personalized-sales-pitches': { title: 'Personalized Sales Pitches', subtitle: 'One-to-one video pitches at scale.', sections: [
    { h: 'Close more deals', p: 'Send tailored AI video pitches to every prospect.' },
  ]},
  'template-partner': { title: 'Template Partner', subtitle: 'Create and sell templates on Core AI Video.', sections: [
    { h: 'Monetize your templates', p: 'Share your best video templates with our community.' },
  ]},
  // Legal
  'privacy-policy': { title: 'Privacy Policy', subtitle: 'How we handle your data.', sections: [
    { h: 'Overview', p: 'This is a placeholder privacy policy. Replace with your legal text.' },
  ]},
  'ai-governance': { title: 'AI Governance', subtitle: 'Our commitment to responsible AI.', sections: [
    { h: 'Responsible AI', p: 'This is a placeholder AI governance statement. Replace with your policy.' },
  ]},
  'terms-and-conditions': { title: 'Terms and Conditions', subtitle: 'The rules for using our service.', sections: [
    { h: 'Terms', p: 'This is a placeholder terms document. Replace with your legal text.' },
  ]},
  'imprint': { title: 'Imprint', subtitle: 'Legal disclosure.', sections: [
    { h: 'Company details', p: 'This is a placeholder imprint. Replace with your company information.' },
  ]},
};

// ---- HTML building blocks ----
function dropdown(label, items) {
  const links = items.map(([t, s]) =>
    `<a href="${href(s)}"${ext(s) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`).join('\n            ');
  return `<li class="has-dropdown">
          <button class="navlink" aria-haspopup="true">${label} <span class="caret">▾</span></button>
          <div class="dropdown">
            ${links}
          </div>
        </li>`;
}

function header(active) {
  const tl = topLevel.map(([t, s]) =>
    `<li><a class="navlink${active === s ? ' active' : ''}" href="${href(s)}">${t}</a></li>`).join('\n        ');
  return `<header class="site-header">
    <a class="logo" href="index.html">Core AI Video</a>
    <button class="menu-toggle" aria-label="Menu" onclick="document.body.classList.toggle('nav-open')">☰</button>
    <nav class="main-nav">
      <ul>
        ${tl}
        ${dropdown('Use Cases', useCases)}
        ${dropdown('Resources', resources)}
      </ul>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-ghost" href="${APP_LOGIN}" target="_blank" rel="noopener">Sign In</a>
      <a class="btn btn-primary" href="${APP_REGISTER}" target="_blank" rel="noopener">Start Free Trial</a>
    </div>
  </header>`;
}

function footer() {
  const col = (title, items) => `<div class="fcol"><h4>${title}</h4>${items.map(([t, s]) =>
    `<a href="${href(s)}"${ext(s) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`).join('')}</div>`;
  return `<footer class="site-footer">
    <div class="footer-grid">
      ${col('Product', [['Home', 'index'], ['Pricing', 'pricing'], ['Done-for-You Video', 'done-for-you-video'], ['Agency Partner Program', 'agency-partner-program'], ['Template Partner', 'template-partner'], ['Affiliates', 'affiliate-program']])}
      ${col('Use Cases', useCases)}
      ${col('Solutions', footerExtra)}
      ${col('Company', [['About Us', 'about-us'], ['Press', 'press'], ['Jobs', 'jobs'], ['FAQs', 'faqs'], ['Step by Step Guide', 'step-by-step-guide'], ['Tutorial Videos', YT], ['Contact', 'contact-us']])}
      ${col('Legal', legal)}
    </div>
    <div class="footer-bottom">&copy; 2026 Core AI Video — coreaivideo.com. All rights reserved.</div>
  </footer>`;
}

function renderSection(sec) {
  if (sec.cards) {
    return `<div class="cards">${sec.cards.map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`;
  }
  if (sec.pricing) {
    return `<div class="pricing">${sec.pricing.map(([name, price, feats]) =>
      `<div class="plan"><h3>${name}</h3><div class="price">${price}</div><ul>${feats.map(f => `<li>${f}</li>`).join('')}</ul><a class="btn btn-primary" href="${APP_REGISTER}" target="_blank" rel="noopener">Choose ${name}</a></div>`).join('')}</div>`;
  }
  if (sec.faq) {
    return `<div class="faq">${sec.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
  }
  if (sec.contact) {
    return `<form class="contact-form" onsubmit="alert('This is a demo form.');return false;">
      <input type="text" placeholder="Your name" required />
      <input type="email" placeholder="Your email" required />
      <textarea placeholder="Your message" rows="5" required></textarea>
      <button class="btn btn-primary" type="submit">Send Message</button>
    </form>`;
  }
  let inner = '';
  if (sec.h) inner += `<h2>${sec.h}</h2>`;
  if (sec.p) inner += `<p>${sec.p}</p>`;
  if (sec.list) inner += `<ul class="ticks">${sec.list.map(i => `<li>${i}</li>`).join('')}</ul>`;
  return `<div class="section">${inner}</div>`;
}

function page(slug, data) {
  const isHome = slug === 'index';
  const sectionsHtml = data.sections.map(renderSection).join('\n      ');
  const heroClass = isHome ? 'hero hero-home' : 'hero';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title} — ${SITE}</title>
  <meta name="description" content="${data.subtitle.replace(/"/g, '&quot;')}" />
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>
  ${header(slug)}
  <main>
    <section class="${heroClass}">
      <h1>${data.title}</h1>
      <p class="lead">${data.subtitle}</p>
      ${isHome ? `<a class="btn btn-primary btn-lg" href="${APP_REGISTER}" target="_blank" rel="noopener">Start Free Trial</a>` : `<a class="btn btn-primary" href="${APP_REGISTER}" target="_blank" rel="noopener">Get Started</a>`}
    </section>
    <div class="container">
      ${sectionsHtml}
    </div>
    <section class="cta-band">
      <h2>Ready to launch your AI video brand?</h2>
      <a class="btn btn-primary btn-lg" href="${APP_REGISTER}" target="_blank" rel="noopener">Start Free Trial</a>
    </section>
  </main>
  ${footer()}
</body>
</html>
`;
}

// ---- Write all pages ----
let count = 0;
for (const [slug, data] of Object.entries(PAGES)) {
  fs.writeFileSync(path.join(OUT, slug + '.html'), page(slug, data), 'utf8');
  count++;
}
console.log('Generated ' + count + ' pages.');
