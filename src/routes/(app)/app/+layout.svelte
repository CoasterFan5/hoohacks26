<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { remoteLogout } from '$lib/remote/logout.remote';
	import { page } from '$app/stores';
	import PHhousesimple from '~icons/ph/house-simple'
	import PHcurrencydollar from '~icons/ph/currency-dollar'
	import PHcloud from '~icons/ph/cloud'
	import PHmoney from '~icons/ph/money'

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();

	function goHome() {
		goto(resolve('/app'));
	}

	function goToFinance() {
		goto(resolve('/app/cFinance'));
	}

	function goToWeather() {
		goto(resolve('/app/rWeatherInt'));
	}

	function goToOptimization() {
		goto(resolve('/app/sProfOpt'));
	}

	const logout = async () => {
		await remoteLogout({});
		goto(resolve('/'));
	};

	const navItems = [
		{ label: 'Home', icon: PHhousesimple,  action: goHome },
		{ label: 'Core Finance', icon: PHcurrencydollar, action: goToFinance },
		{ label: 'Weather Intelligence', icon: PHcloud, action: goToWeather },
		{ label: 'Profit Optimization', icon: PHmoney, action: goToOptimization },
	];
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="app-shell">

	<!-- ── SIDEBAR ── -->
	<aside class="sidebar">

		<!-- Logo -->
		<button class="brand" onclick={goHome}>
			<span class="logo-moo">Moo</span><span class="logo-nance">nance</span>
		</button>

		<div class="sidebar-divider"></div>

		<!-- Nav -->
		<nav class="sidebar-nav">
			<div class="nav-label">Navigation</div>
			{#each navItems as item}
				<button class="nav-item" onclick={item.action}>
					<item.icon/>
					<span class="nav-text">{item.label}</span>
				</button>
			{/each}
		</nav>

		<!-- Spacer pushes logout to bottom -->
		<div class="sidebar-spacer"></div>

		<div class="sidebar-divider"></div>

		<!-- Logout -->
		<button class="logout-btn" onclick={logout}>
			<span class="nav-icon">↩</span>
			<span class="nav-text">Logout</span>
		</button>

		<!-- Footer brand mark -->
		<div class="sidebar-foot">
			<span class="foot-mono">Financial intelligence</span>
			<span class="foot-mono">for the land.</span>
		</div>

	</aside>

	<!-- ── MAIN CONTENT ── -->
	<main class="page-content">
		{@render children?.()}
	</main>

</div>

<style>
	/* ── TOKENS (match landing page) ── */
	:root {
		--soil:   #0F0A04;
		--earth:  #1C1208;
		--bark:   #2E1E0A;
		--rust:   #C4541A;
		--amber:  #D4922A;
		--wheat:  #E8C87A;
		--cream:  #F0E8D5;
		--muted:  #8A7A62;
		--sage:   #6B8F5E;
		--sidebar-w: 230px;
	}

	/* ── RESET ── */
	:global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
	:global(body) {
		font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
		background: var(--earth);
		color: var(--cream);
		min-height: 100vh;
	}

	/* ── SHELL ── */
	.app-shell {
		display: flex;
		min-height: 100vh;
	}

	/* ── SIDEBAR ── */
	.sidebar {
		position: fixed;
		top: 0; left: 0; bottom: 0;
		width: var(--sidebar-w);
		background: var(--soil);
		border-right: 1px solid rgba(212,146,42,.15);
		display: flex;
		flex-direction: column;
		padding: 28px 0 20px;
		z-index: 100;
	}

	/* Brand / logo */
	.brand {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0 24px 0;
		margin-bottom: 24px;
		text-align: left;
		font-family: 'Lora', serif;
		font-size: 22px;
		font-weight: 700;
		line-height: 1;
		transition: opacity .2s;
	}
	.brand:hover { opacity: .8; }
	.logo-moo   { color: var(--wheat); }
	.logo-nance { color: var(--amber); }

	/* Divider */
	.sidebar-divider {
		height: 1px;
		background: rgba(212,146,42,.12);
		margin: 0 16px 20px;
	}

	/* Nav section label */
	.nav-label {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		letter-spacing: .18em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 0 24px;
		margin-bottom: 8px;
	}

	/* Nav items */
	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 12px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		background: none;
		border: none;
		border-radius: 6px;
		padding: 11px 12px;
		cursor: pointer;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		font-weight: 400;
		color: var(--muted);
		text-align: left;
		transition: background .18s, color .18s;
	}
	.nav-item:hover {
		background: rgba(212,146,42,.08);
		color: var(--cream);
	}

	.nav-icon {
		font-size: 16px;
		width: 20px;
		text-align: center;
		flex-shrink: 0;
	}

	.nav-text { flex: 1; }

	/* Spacer */
	.sidebar-spacer { flex: 1; }

	/* Logout */
	.logout-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		width: calc(100% - 24px);
		margin: 0 12px 16px;
		background: none;
		border: 1px solid rgba(196,84,26,.3);
		border-radius: 6px;
		padding: 11px 12px;
		cursor: pointer;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		color: var(--rust);
		text-align: left;
		transition: background .18s, border-color .18s;
	}
	.logout-btn:hover {
		background: rgba(196,84,26,.1);
		border-color: var(--rust);
	}

	/* Footer text */
	.sidebar-foot {
		padding: 0 24px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.foot-mono {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		color: rgba(138,122,98,.45);
		letter-spacing: .06em;
	}

	/* ── MAIN CONTENT ── */
	.page-content {
		margin-left: var(--sidebar-w);
		flex: 1;
		padding: 40px 48px;
		max-width: calc(1200px + var(--sidebar-w));
		min-height: 100vh;
		background: var(--earth);
	}

	/* ── MOBILE: collapse sidebar to top bar ── */
	@media (max-width: 768px) {
		:root { --sidebar-w: 0px; }

		.sidebar {
			position: fixed;
			top: 0; left: 0; right: 0; bottom: auto;
			width: 100%;
			flex-direction: row;
			align-items: center;
			padding: 0 16px;
			height: 56px;
			border-right: none;
			border-bottom: 1px solid rgba(212,146,42,.15);
			overflow-x: auto;
		}

		.brand { margin-bottom: 0; font-size: 18px; padding: 0 8px 0 0; flex-shrink: 0; }
		.sidebar-divider  { display: none; }
		.nav-label        { display: none; }
		.sidebar-foot     { display: none; }
		.sidebar-spacer   { display: none; }

		.sidebar-nav {
			flex-direction: row;
			padding: 0;
			gap: 4px;
			flex: 1;
		}

		.nav-item {
			flex-direction: row;
			padding: 8px 10px;
			white-space: nowrap;
			font-size: 13px;
		}

		.logout-btn {
			margin: 0;
			white-space: nowrap;
			flex-shrink: 0;
			width: auto;
			padding: 8px 12px;
		}

		.page-content {
			margin-left: 0;
			margin-top: 56px;
			padding: 24px 20px;
		}
	}
</style>