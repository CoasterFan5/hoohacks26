<nav>
	<div class="nav-inner">
		<a href="/" class="logo">
			<span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
		</a>
		<div class="nav-links">
			<a href="/#how-it-works">How it works</a>
			<a href="/#features">Features</a>
			<a href="/#faq">FAQ</a>
			<a href="/auth/login" class="btn-nav">Sign In</a>
		</div>
	</div>
</nav>

<style>
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
		font-family: var(--font-serif);
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
		background: var(--accent-alt) !important;
	}

	@media (max-width: 768px) {
		.nav-links a:not(.btn-nav) {
			display: none;
		}
	}
</style>
