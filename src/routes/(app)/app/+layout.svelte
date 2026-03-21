<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { remoteLogout } from '$lib/remote/logout.remote';

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
      await remoteLogout({})
      goto(resolve("/"))
	}
</script>

<div class="app-shell">
	<header class="topbar">
		<button class="brand" onclick={goHome}>
			Moonance
		</button>

		<nav class="nav-links">
			<button onclick={goHome}>Home</button>
			<button onclick={goToFinance}>Current Finance</button>
			<button onclick={goToWeather}>Weather Intelligence</button>
			<button onclick={goToOptimization}>Profit Optimization</button>
		</nav>

		<div class="actions">
			<button class="logout-btn" onclick={logout}>Logout</button>
		</div>
	</header>

	<main class="page-content">
		{@render children?.()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		background: #f8fafc;
		color: #0f172a;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-shell {
		min-height: 100vh;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		border-bottom: 1px solid #e2e8f0;
		backdrop-filter: blur(8px);
	}

	.brand {
		font-size: 1.2rem;
		font-weight: 800;
		cursor: pointer;
		background: none;
		border: none;
	}

	.nav-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		flex: 1;
	}

	.nav-links button,
	.actions button {
		border: 1px solid #cbd5e1;
		background: white;
		color: #0f172a;
		padding: 0.65rem 1rem;
		border-radius: 10px;
		cursor: pointer;
		font-size: 0.95rem;
		font-weight: 600;
		transition:
			background 0.18s ease,
			transform 0.18s ease,
			box-shadow 0.18s ease;
	}

	.nav-links button:hover,
	.actions button:hover {
		background: #f1f5f9;
		transform: translateY(-1px);
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.logout-btn {
		background: #0f172a;
		color: white;
		border-color: #0f172a;
	}

	.logout-btn:hover {
		background: #1e293b;
	}

	.page-content {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	@media (max-width: 950px) {
		.topbar {
			flex-direction: column;
			align-items: stretch;
		}

		.brand {
			text-align: center;
		}

		.nav-links {
			justify-content: center;
		}

		.actions {
			justify-content: center;
		}
	}
</style>
