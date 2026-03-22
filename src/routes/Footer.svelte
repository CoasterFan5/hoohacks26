<footer>
	<div class="container footer-inner">
		<div class="footer-logo">
			<span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
			<div class="footer-tagline">Financial intelligence for the land.</div>
		</div>
		<div class="footer-links">
			<a href="/#features">Features</a>
			<a href="/#how-it-works">How It Works</a>
			<a href="/#faq">FAQ</a>
			<a href="/auth/login">Sign In</a>
		</div>
		<div class="footer-copy">
			© 2026 Moonance. Built for ranchers, by people who respect the land.
		</div>
	</div>
</footer>

<style>
	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 32px;
	}

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
		font-family: var(--font-serif);
		font-size: 18px;
		color: var(--wheat);
	}
	.footer-logo .logo-nance {
		font-family: var(--font-serif);
		font-size: 18px;
		color: var(--amber);
	}
	.footer-tagline {
		font-size: 11px;
		color: var(--muted);
		margin-top: 4px;
		font-family: var(--font-mono);
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
		font-family: var(--font-mono);
	}
</style>
