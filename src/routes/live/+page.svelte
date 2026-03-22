<script lang="ts">
	import { livePriceMap } from '$lib/liveAsset/stores';
	import LiveRow from './LiveRow.svelte';
</script>

<svelte:head>
	<title>Live Cattle Prices | Moonance</title>
	<meta name="description" content="Track live cattle prices and access our API gateway." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
		</a>
		<div class="nav-links">
			<a href="/#how-it-works">How It Works</a>
			<a href="/#features">Features</a>
			<a href="/live">Live Prices</a>
			<a href="/auth/login" class="btn-nav">Sign in</a>
		</div>
	</div>
</nav>

<main>
	<section class="hero">
		<div class="hero-grain"></div>
		<div class="hero-content">
			<div class="eyebrow">Real-Time Markets</div>
			<h1>Track live <em>cattle</em> prices</h1>
			<p class="hero-sub">
				Stay updated with the latest market data to value your herd and make smarter decisions for
				your operation.
			</p>
		</div>
	</section>

	<section class="live-data">
		<div class="container">
			<div class="section-label">Current Rates</div>
			<h2>Market Overview</h2>

			<div class="price-grid">
				{#each Object.entries(livePriceMap) as item, index (index)}
					<div class="price-card" style="animation-delay:{index * 0.1}s">
						<LiveRow priceStoreName={item[0]} priceStore={item[1]} />
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="api-gateway">
		<div class="container api-inner">
			<div class="api-text">
				<div class="section-label">Developer Access</div>
				<h2>API Gateway</h2>
				<p>
					Need programmatic access to our real-time data? Integrate Moonance market prices directly
					into your own tools and dashboards.
				</p>
				<p>
					Access our live endpoint at <strong>/api/live</strong> for JSON-formatted price updates.
				</p>
				<div class="api-cta">
					<a href="/api/live" class="btn-primary" target="_blank" rel="noopener noreferrer"
						>View API Endpoint</a
					>
				</div>
			</div>
			<div class="api-visual">
				<div class="code-window">
					<div class="code-bar">
						<div class="dash-dot r"></div>
						<div class="dash-dot y"></div>
						<div class="dash-dot g"></div>
						<span class="dash-label">GET /api/live</span>
					</div>
					<div class="code-content">
						<pre><code
								>&#123;
  "status": "success",
  "data": &#123;
    "live_cattle": 182.45,
    "feeder_cattle": 245.30,
    "lean_hogs": 89.15
  &#125;
&#125;</code
							></pre>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<footer>
	<div class="container footer-inner">
		<div class="footer-logo">
			<a href="/" style="text-decoration: none;">
				<span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
			</a>
			<div class="footer-tagline">Financial management for ranchers.</div>
		</div>
		<div class="footer-links">
			<a href="/#features">Features</a>
			<a href="/#how-it-works">How It Works</a>
			<a href="/live">Live Prices</a>
			<a href="/auth/login">Sign In</a>
		</div>
		<div class="footer-copy">
			&copy; {new Date().getFullYear()} Moonance. All rights reserved.
		</div>
	</div>
</footer>

<style>
	/* ── BASE STYLES REUSED FROM HOME PAGE ── */
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(body) {
		font-family: 'DM Sans', sans-serif;
		background: #0f0a04;
		color: #f0e8d5;
		line-height: 1.6;
	}

	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 32px;
	}

	/* ── NAV ── */
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(15, 10, 4, 0.88);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(212, 146, 42, 0.15);
	}
	.nav-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 32px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.logo {
		text-decoration: none;
		font-family: 'Lora', serif;
		font-size: 22px;
		font-weight: 700;
	}
	.logo-moo {
		color: var(--wheat);
	}
	.logo-nance {
		color: var(--amber);
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 28px;
	}
	.nav-links a {
		color: var(--muted);
		text-decoration: none;
		font-size: 14px;
		font-weight: 400;
		transition: color 0.2s;
	}
	.nav-links a:hover {
		color: var(--cream);
	}
	.btn-nav {
		background: var(--rust);
		color: var(--cream) !important;
		padding: 8px 20px;
		border-radius: 4px;
		font-weight: 500 !important;
		transition: background 0.2s !important;
	}
	.btn-nav:hover {
		background: #d4621f !important;
	}

	/* ── BUTTONS & LABELS ── */
	.btn-primary {
		display: inline-block;
		background: var(--rust);
		color: var(--cream);
		padding: 14px 32px;
		border-radius: 4px;
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.btn-primary:hover {
		background: #d4621f;
		transform: translateY(-1px);
	}
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.18em;
		color: var(--amber);
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	h2 {
		font-family: 'Lora', serif;
		font-size: clamp(26px, 3.5vw, 40px);
		line-height: 1.2;
		color: var(--cream);
		margin-bottom: 48px;
		max-width: 620px;
	}

	/* ── HERO ── */
	.hero {
		padding: 160px 32px 60px;
		max-width: 1100px;
		margin: 0 auto;
		position: relative;
		text-align: center;
	}
	.hero-grain {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
		opacity: 0.5;
	}
	.hero-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.eyebrow {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.2em;
		color: var(--amber);
		text-transform: uppercase;
		margin-bottom: 20px;
	}
	h1 {
		font-family: 'Lora', serif;
		font-size: clamp(36px, 5vw, 58px);
		line-height: 1.15;
		color: var(--cream);
		margin-bottom: 24px;
	}
	h1 em {
		color: var(--wheat);
		font-style: italic;
	}
	.hero-sub {
		font-size: 17px;
		line-height: 1.75;
		color: var(--muted);
		max-width: 600px;
		margin-bottom: 36px;
		font-weight: 300;
	}

	/* ── LIVE DATA ── */
	.live-data {
		padding: 40px 0 100px;
		position: relative;
		z-index: 1;
	}
	.price-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}
	.price-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 28px;
		transition: border-color 0.2s;
	}
	.price-card:hover {
		border-color: rgba(212, 146, 42, 0.3);
	}

	/* ── API GATEWAY ── */
	.api-gateway {
		padding: 100px 0;
		background: var(--earth);
		border-top: 1px solid rgba(212, 146, 42, 0.1);
	}
	.api-inner {
		display: flex;
		gap: 60px;
		align-items: center;
		flex-wrap: wrap;
	}
	.api-text {
		flex: 1;
		min-width: 300px;
	}
	.api-text p {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.8;
		margin-bottom: 18px;
	}
	.api-text strong {
		color: var(--amber);
		font-family: 'DM Mono', monospace;
	}
	.api-cta {
		margin-top: 32px;
	}
	.api-visual {
		flex: 1;
		min-width: 300px;
	}
	.code-window {
		background: var(--soil);
		border: 1px solid rgba(212, 146, 42, 0.15);
		border-radius: 8px;
		overflow: hidden;
	}
	.code-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
		background: var(--earth);
		border-bottom: 1px solid rgba(212, 146, 42, 0.1);
	}
	.dash-label {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		color: var(--muted);
		margin-left: 8px;
	}
	.code-content {
		padding: 24px;
	}
	.code-content pre {
		font-family: 'DM Mono', monospace;
		font-size: 13px;
		color: var(--wheat);
		line-height: 1.7;
		white-space: pre-wrap;
	}
	.dash-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.dash-dot.r {
		background: #c44040;
	}
	.dash-dot.y {
		background: var(--amber);
	}
	.dash-dot.g {
		background: var(--sage);
	}

	/* ── FOOTER ── */
	footer {
		background: var(--soil);
		border-top: 1px solid rgba(212, 146, 42, 0.08);
		padding: 40px 0;
	}
	.footer-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
		align-items: center;
		justify-content: space-between;
	}
	.footer-logo .logo-moo {
		font-family: 'Lora', serif;
		font-size: 18px;
		color: var(--wheat);
	}
	.footer-logo .logo-nance {
		font-family: 'Lora', serif;
		font-size: 18px;
		color: var(--amber);
	}
	.footer-tagline {
		font-size: 11px;
		color: var(--muted);
		margin-top: 4px;
		font-family: 'DM Mono', monospace;
	}
	.footer-links {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
	}
	.footer-links a {
		font-size: 13px;
		color: var(--muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-links a:hover {
		color: var(--cream);
	}
	.footer-copy {
		font-size: 11px;
		color: rgba(138, 122, 98, 0.5);
		font-family: 'DM Mono', monospace;
	}
