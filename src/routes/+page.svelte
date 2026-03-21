<script>
  let email = '';
  let submitted = false;

  function handleSignup() {
    if (email.trim()) {
      submitted = true;
    }
  }

  const features = [
    {
      icon: '📊',
      title: 'Income & Expense Tracking',
      desc: 'Log every sale, feed bill, vet visit, and fuel receipt in one place — categorized the way ranchers actually think.'
    },
    {
      icon: '🐄',
      title: 'Herd Valuation',
      desc: 'Know what your herd is worth today, priced against live market data — not a guess, a real number.'
    },
    {
      icon: '📈',
      title: 'Profit Maximization',
      desc: 'Get actionable recommendations on when to sell, where to cut costs, and how to grow your margins.'
    },
    {
      icon: '🔭',
      title: 'Medium-Term Projections',
      desc: '6 to 18 month profitability forecasts built from your own operation data — not generic industry averages.'
    },
    {
      icon: '🌦️',
      title: 'Weather Intelligence',
      desc: 'Region-specific weather alerts, drought monitors, and the financial impact of incoming storms on your bottom line.'
    },
    {
      icon: '💡',
      title: 'Smart Recommendations',
      desc: 'Decisions backed by data. Moonance tells you not just what happened — but what to do about it.'
    }
  ];

  const steps = [
    { num: '01', title: 'Create your operation profile', body: 'Tell us about your ranch — size, herd, location, and what you run. Takes under five minutes.' },
    { num: '02', title: 'Connect your financial activity', body: 'Log income and expenses manually, or import from your existing records. No accountant degree required.' },
    { num: '03', title: 'See the full picture', body: 'Your dashboard surfaces your real financial position — herd value, profit trend, and what to do next.' },
  ];

  const faqs = [
    { q: 'Who is Moonance built for?', a: 'Ranchers and farmers running operations of any size — from a small family spread to a large commercial cattle operation. If you raise livestock or grow crops, Moonance was made for you.' },
    { q: 'Do I need to be a finance expert?', a: 'Absolutely not. Moonance is designed for people who spend their days in the field, not behind a spreadsheet. Everything is plain-language and built around how you already think about your operation.' },
    { q: 'Is my financial data secure?', a: 'Yes. Moonance is built to bank-grade security standards — encrypted at rest and in transit, with strict access controls. Your data is yours.' },
    { q: 'When is Moonance available?', a: "We're in active development. Sign up below to get early access and help shape the product." },
  ];

  let openFaq = null;
  function toggleFaq(i) {
    openFaq = openFaq === i ? null : i;
  }
</script>

<svelte:head>
  <title>Moonance — Financial Intelligence for Ranchers</title>
  <meta name="description" content="Moonance is the financial management platform built for ranchers and farmers. Track income, value your herd, and make smarter decisions about your operation." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║           NAV                    ║ -->
<!-- ╚══════════════════════════════════╝ -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
    </a>
    <div class="nav-links">
      <a href="#how-it-works">How it works</a>
      <a href="#features">Features</a>
      <a href="#faq">FAQ</a>
      <a href="/login" class="btn-nav">Sign In</a>
    </div>
  </div>
</nav>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║           HERO                   ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="hero">
  <div class="hero-grain"></div>
  <div class="hero-content">
    <div class="eyebrow">Financial Intelligence for the Land</div>
    <h1>
      Your ranch runs on <em>grit.</em><br />
      Now let your finances<br />
      run on <em>data.</em>
    </h1>
    <p class="hero-sub">
      Moonance is the financial platform built for ranchers and farmers — not accountants.
      Track income, value your herd, forecast profits, and know exactly where your operation stands.
    </p>
    <div class="hero-cta">
      <a href="/login" class="btn-primary">Get Early Access</a>
      <a href="#how-it-works" class="btn-ghost">See How It Works ↓</a>
    </div>
    <div class="hero-trust">
      <span>🔒 Bank-grade security</span>
      <span>🐄 Built for ranchers</span>
      <span>📍 U.S. operations</span>
    </div>
  </div>
  <div class="hero-visual">
    <div class="dash-mockup">
      <div class="dash-bar">
        <div class="dash-dot r"></div><div class="dash-dot y"></div><div class="dash-dot g"></div>
        <span class="dash-label">moonance / dashboard</span>
      </div>
      <div class="dash-kpis">
        <div class="kpi">
          <div class="kpi-label">Net Cash Position</div>
          <div class="kpi-val green">$84,320</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">Herd Valuation</div>
          <div class="kpi-val">$412,800</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">YTD Income</div>
          <div class="kpi-val">$198,500</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">YTD Expenses</div>
          <div class="kpi-val red">$114,180</div>
        </div>
      </div>
      <div class="dash-chart">
        <div class="chart-label">6-Month Profit Trend</div>
        <div class="chart-bars">
          {#each [40, 55, 48, 70, 62, 83] as h, i}
            <div class="bar" style="height:{h}%; animation-delay:{i * 0.1}s"></div>
          {/each}
        </div>
      </div>
      <div class="dash-reco">
        <div class="reco-icon">💡</div>
        <div class="reco-text">
          <strong>Recommendation:</strong> Feeder prices are up 8% this week. Consider early Q4 sale for 3 head.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║        WHO WE SERVE              ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="who">
  <div class="container">
    <div class="section-label">Who Moonance Is For</div>
    <h2>Built for the people who feed America</h2>
    <div class="persona-grid">
      <div class="persona">
        <div class="persona-icon">🐂</div>
        <h3>Cattle Ranchers</h3>
        <p>From cow-calf operations to stocker and feeder programs. Track herd value and know your margins per head.</p>
      </div>
      <div class="persona">
        <div class="persona-icon">🌾</div>
        <h3>Crop Farmers</h3>
        <p>Row crops, hay, grain — log your inputs, track your yield revenue, and project your next season's performance.</p>
      </div>
      <div class="persona">
        <div class="persona-icon">🏡</div>
        <h3>Family Operations</h3>
        <p>Small and mid-size family farms that need a clear financial picture without a full-time CFO on payroll.</p>
      </div>
      <div class="persona">
        <div class="persona-icon">🤝</div>
        <h3>Agribusiness Managers</h3>
        <p>Manage multiple enterprises, profit centers, or leased operations from a single unified dashboard.</p>
      </div>
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║        WHY MOONANCE              ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="why">
  <div class="container why-inner">
    <div class="why-text">
      <div class="section-label">Why Moonance Exists</div>
      <h2>Mainstream finance tools weren't built for your world</h2>
      <p>QuickBooks doesn't know what a cow-calf pair is worth. Your bank's app doesn't understand seasonal income. Spreadsheets break and take your data with them.</p>
      <p>Ranchers and farmers manage some of the most complex, variable financial situations in any industry — weather-dependent income, commodity-priced inventory, seasonal cash crunches, and multi-year capital equipment decisions. They've been doing it with tools built for small retail businesses.</p>
      <p><strong>Moonance changes that.</strong> Every feature, every data model, every recommendation is built around the reality of agricultural operations — not adapted from something else.</p>
    </div>
    <div class="why-stats">
      <div class="stat">
        <div class="stat-num">3.4M</div>
        <div class="stat-desc">Farm operators in the U.S. underserved by existing fintech</div>
      </div>
      <div class="stat">
        <div class="stat-num">$543B</div>
        <div class="stat-desc">Total U.S. agricultural output annually</div>
      </div>
      <div class="stat">
        <div class="stat-num">68%</div>
        <div class="stat-desc">Of farmers report financial stress due to unpredictable cash flow</div>
      </div>
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║        HOW IT WORKS              ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="how" id="how-it-works">
  <div class="container">
    <div class="section-label">How It Works</div>
    <h2>Simple enough for a phone in a truck. Powerful enough for serious operations.</h2>
    <div class="steps">
      {#each steps as step, i}
        <div class="step">
          <div class="step-num">{step.num}</div>
          <div class="step-content">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
          {#if i < steps.length - 1}
            <div class="step-arrow">→</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║          FEATURES                ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="features" id="features">
  <div class="container">
    <div class="section-label">What's Inside</div>
    <h2>Everything your operation's finances need. Nothing it doesn't.</h2>
    <div class="features-grid">
      {#each features as f, i}
        <div class="feature-card" style="animation-delay:{i * 0.08}s">
          <div class="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║            FAQ                   ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="faq" id="faq">
  <div class="container faq-inner">
    <div class="section-label">FAQ</div>
    <h2>Questions we hear from the field</h2>
    <div class="faq-list">
      {#each faqs as item, i}
        <div class="faq-item" class:open={openFaq === i}>
          <button class="faq-q" on:click={() => toggleFaq(i)}>
            {item.q}
            <span class="faq-arrow">{openFaq === i ? '−' : '+'}</span>
          </button>
          {#if openFaq === i}
            <div class="faq-a">{item.a}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║            CTA                   ║ -->
<!-- ╚══════════════════════════════════╝ -->
<section class="cta-section">
  <div class="container">
    <h2>Ready to know exactly where your operation stands?</h2>
    <p>Join ranchers and farmers getting early access to Moonance.</p>
    {#if !submitted}
      <div class="signup-form">
        <input
          type="email"
          placeholder="your@email.com"
          bind:value={email}
          on:keydown={(e) => e.key === 'Enter' && handleSignup()}
        />
        <button class="btn-primary" on:click={handleSignup}>Request Access</button>
      </div>
    {:else}
      <div class="submitted">✅ You're on the list. We'll be in touch soon.</div>
    {/if}
    <div class="cta-note">No credit card. No commitments. Just early access.</div>
  </div>
</section>

<!-- ╔══════════════════════════════════╗ -->
<!-- ║           FOOTER                 ║ -->
<!-- ╚══════════════════════════════════╝ -->
<footer>
  <div class="container footer-inner">
    <div class="footer-logo">
      <span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
      <div class="footer-tagline">Financial intelligence for the land.</div>
    </div>
    <div class="footer-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      <a href="#faq">FAQ</a>
      <a href="/login">Sign In</a>
    </div>
    <div class="footer-copy">© 2025 Moonance. Built for ranchers, by people who respect the land.</div>
  </div>
</footer>

<style>
  /* ── RESET & BASE ── */
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(html) { scroll-behavior: smooth; }
  :global(body) {
    font-family: 'DM Sans', sans-serif;
    background: #0F0A04;
    color: #F0E8D5;
    line-height: 1.6;
  }

  /* ── TOKENS ── */
  :global(:root) {
    --soil:    #0F0A04;
    --earth:   #1C1208;
    --bark:    #2E1E0A;
    --rust:    #C4541A;
    --amber:   #D4922A;
    --wheat:   #E8C87A;
    --cream:   #F0E8D5;
    --sage:    #6B8F5E;
    --sky:     #7FB5C8;
    --muted:   #8A7A62;
    --red:     #C44040;
    --green:   #5A9E5A;
  }

  /* ── LAYOUT ── */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 32px; }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(15, 10, 4, 0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(212,146,42,.15);
  }
  .nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  .logo { text-decoration: none; font-family: 'Lora', serif; font-size: 22px; font-weight: 700; }
  .logo-moo  { color: var(--wheat); }
  .logo-nance { color: var(--amber); }
  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; font-weight: 400; transition: color .2s; }
  .nav-links a:hover { color: var(--cream); }
  .btn-nav {
    background: var(--rust); color: var(--cream) !important;
    padding: 8px 20px; border-radius: 4px; font-weight: 500 !important;
    transition: background .2s !important;
  }
  .btn-nav:hover { background: #D4621F !important; }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-block;
    background: var(--rust); color: var(--cream);
    padding: 14px 32px; border-radius: 4px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
    text-decoration: none; border: none; cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .btn-primary:hover { background: #D4621F; transform: translateY(-1px); }
  .btn-ghost {
    display: inline-block;
    color: var(--wheat); border: 1px solid rgba(232,200,122,.3);
    padding: 14px 28px; border-radius: 4px;
    font-size: 15px; font-weight: 400; text-decoration: none;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: var(--wheat); color: #fff; }

  /* ── SECTION LABELS ── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .18em;
    color: var(--amber); text-transform: uppercase;
    margin-bottom: 12px;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 32px 80px;
    max-width: 1100px; margin: 0 auto;
    gap: 64px;
    position: relative;
  }
  .hero-grain {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: .5;
  }
  .hero-content { flex: 1; min-width: 0; position: relative; z-index: 1; }
  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .2em;
    color: var(--amber); text-transform: uppercase;
    margin-bottom: 20px;
  }
  h1 {
    font-family: 'Lora', serif;
    font-size: clamp(36px, 5vw, 58px);
    line-height: 1.15; color: var(--cream);
    margin-bottom: 24px;
  }
  h1 em { color: var(--wheat); font-style: italic; }
  .hero-sub {
    font-size: 17px; line-height: 1.75;
    color: var(--muted); max-width: 500px;
    margin-bottom: 36px; font-weight: 300;
  }
  .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .hero-trust {
    display: flex; gap: 20px; flex-wrap: wrap;
    font-size: 12px; color: var(--muted);
    font-family: 'DM Mono', monospace;
  }

  /* ── DASHBOARD MOCKUP ── */
  .hero-visual { flex: 0 0 420px; position: relative; z-index: 1; }
  .dash-mockup {
    background: #1C1208;
    border: 1px solid rgba(212,146,42,.2);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
  }
  .dash-bar {
    background: #2E1E0A;
    padding: 10px 16px;
    display: flex; align-items: center; gap: 6px;
    border-bottom: 1px solid rgba(212,146,42,.1);
  }
  .dash-dot { width: 10px; height: 10px; border-radius: 50%; }
  .dash-dot.r { background: #C44040; }
  .dash-dot.y { background: var(--amber); }
  .dash-dot.g { background: var(--sage); }
  .dash-label {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--muted); margin-left: 8px;
  }
  .dash-kpis {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1px; background: rgba(212,146,42,.08);
    border-bottom: 1px solid rgba(212,146,42,.1);
  }
  .kpi {
    background: #1C1208;
    padding: 16px; display: flex; flex-direction: column; gap: 4px;
  }
  .kpi-label { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .kpi-val { font-family: 'Lora', serif; font-size: 20px; font-weight: 600; color: var(--cream); }
  .kpi-val.green { color: var(--green); }
  .kpi-val.red   { color: var(--red); }
  .dash-chart { padding: 16px; border-bottom: 1px solid rgba(212,146,42,.1); }
  .chart-label { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .chart-bars {
    display: flex; align-items: flex-end; gap: 6px; height: 60px;
  }
  .bar {
    flex: 1; background: var(--rust); border-radius: 2px 2px 0 0;
    animation: growBar .8s ease forwards;
    transform-origin: bottom;
  }
  @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .dash-reco {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px;
    background: rgba(90,158,90,.08);
    border-top: 1px solid rgba(90,158,90,.2);
  }
  .reco-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .reco-text { font-size: 11px; line-height: 1.5; color: #A8C8A0; }
  .reco-text strong { color: var(--sage); }

  /* ── WHO ── */
  .who { padding: 100px 0; background: var(--earth); }
  .who h2, .why h2, .how h2, .features h2, .faq h2 {
    font-family: 'Lora', serif;
    font-size: clamp(26px, 3.5vw, 40px);
    line-height: 1.2; color: var(--cream);
    margin-bottom: 48px; max-width: 620px;
  }
  .persona-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
  }
  .persona {
    background: var(--bark);
    border: 1px solid rgba(212,146,42,.12);
    border-radius: 6px; padding: 28px 24px;
    transition: border-color .2s, transform .2s;
  }
  .persona:hover { border-color: rgba(212,146,42,.35); transform: translateY(-3px); }
  .persona-icon { font-size: 28px; margin-bottom: 14px; }
  .persona h3 { font-family: 'Lora', serif; font-size: 17px; color: var(--wheat); margin-bottom: 10px; }
  .persona p  { font-size: 13px; color: var(--muted); line-height: 1.65; }

  /* ── WHY ── */
  .why { padding: 100px 0; }
  .why-inner { display: flex; gap: 80px; align-items: flex-start; flex-wrap: wrap; }
  .why-text { flex: 1; min-width: 280px; }
  .why-text p { font-size: 15px; color: var(--muted); line-height: 1.8; margin-bottom: 18px; }
  .why-text strong { color: var(--cream); }
  .why-stats { display: flex; flex-direction: column; gap: 32px; flex: 0 0 220px; }
  .stat-num {
    font-family: 'Lora', serif; font-size: 42px; font-weight: 700;
    color: var(--amber); line-height: 1;
  }
  .stat-desc { font-size: 13px; color: var(--muted); margin-top: 6px; line-height: 1.55; }

  /* ── HOW ── */
  .how { padding: 100px 0; background: var(--earth); }
  .steps { display: flex; gap: 0; flex-wrap: wrap; margin-top: 48px; }
  .step {
    flex: 1; min-width: 220px;
    display: flex; flex-direction: column; gap: 14px;
    position: relative; padding-right: 40px;
  }
  .step-num {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--rust); letter-spacing: .15em;
  }
  .step h3 { font-family: 'Lora', serif; font-size: 18px; color: var(--wheat); }
  .step p  { font-size: 14px; color: var(--muted); line-height: 1.7; }
  .step-arrow {
    position: absolute; right: 8px; top: 30px;
    font-size: 22px; color: rgba(212,146,42,.3);
  }

  /* ── FEATURES ── */
  .features { padding: 100px 0; }
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px; margin-top: 8px;
  }
  .feature-card {
    background: var(--bark);
    border: 1px solid rgba(212,146,42,.1);
    border-radius: 6px; padding: 28px 26px;
    transition: border-color .2s, transform .2s;
  }
  .feature-card:hover { border-color: rgba(212,146,42,.3); transform: translateY(-2px); }
  .feature-icon { font-size: 24px; margin-bottom: 14px; }
  .feature-card h3 { font-family: 'Lora', serif; font-size: 16px; color: var(--wheat); margin-bottom: 10px; }
  .feature-card p  { font-size: 13px; color: var(--muted); line-height: 1.7; }

  /* ── FAQ ── */
  .faq { padding: 100px 0; background: var(--earth); }
  .faq-inner { max-width: 700px; }
  .faq-list { margin-top: 8px; }
  .faq-item {
    border-bottom: 1px solid rgba(212,146,42,.12);
  }
  .faq-q {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    padding: 22px 0;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
    color: var(--cream); text-align: left; gap: 16px;
  }
  .faq-arrow { color: var(--amber); font-size: 20px; flex-shrink: 0; }
  .faq-a {
    font-size: 14px; color: var(--muted); line-height: 1.75;
    padding-bottom: 20px;
  }

  /* ── CTA SECTION ── */
  .cta-section {
    padding: 100px 0;
    text-align: center;
    background: linear-gradient(180deg, var(--soil) 0%, #1A0E04 100%);
    border-top: 1px solid rgba(212,146,42,.1);
  }
  .cta-section h2 {
    font-family: 'Lora', serif;
    font-size: clamp(24px, 3.5vw, 40px);
    color: var(--cream); margin-bottom: 14px;
  }
  .cta-section p { font-size: 16px; color: var(--muted); margin-bottom: 36px; }
  .signup-form {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    max-width: 480px; margin: 0 auto 16px;
  }
  .signup-form input {
    flex: 1; min-width: 200px;
    background: var(--bark); border: 1px solid rgba(212,146,42,.2);
    color: var(--cream); padding: 14px 18px; border-radius: 4px;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: border-color .2s;
  }
  .signup-form input:focus { border-color: var(--amber); }
  .signup-form input::placeholder { color: var(--muted); }
  .submitted {
    font-size: 16px; color: var(--sage);
    padding: 14px; margin-bottom: 16px;
  }
  .cta-note { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; }

  /* ── FOOTER ── */
  footer {
    background: var(--soil);
    border-top: 1px solid rgba(212,146,42,.08);
    padding: 40px 0;
  }
  .footer-inner {
    display: flex; flex-wrap: wrap; gap: 32px;
    align-items: center; justify-content: space-between;
  }
  .footer-logo .logo-moo  { font-family: 'Lora', serif; font-size: 18px; color: var(--wheat); }
  .footer-logo .logo-nance { font-family: 'Lora', serif; font-size: 18px; color: var(--amber); }
  .footer-tagline { font-size: 11px; color: var(--muted); margin-top: 4px; font-family: 'DM Mono', monospace; }
  .footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
  .footer-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color .2s; }
  .footer-links a:hover { color: var(--cream); }
  .footer-copy { font-size: 11px; color: rgba(138,122,98,.5); font-family: 'DM Mono', monospace; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hero { flex-direction: column; padding-top: 100px; }
    .hero-visual { display: none; }
    .why-inner { flex-direction: column; }
    .why-stats { flex-direction: row; flex-wrap: wrap; gap: 24px; }
    .steps { flex-direction: column; }
    .step-arrow { display: none; }
    .nav-links a:not(.btn-nav) { display: none; }
  }
</style>