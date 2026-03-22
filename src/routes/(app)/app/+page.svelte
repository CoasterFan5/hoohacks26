<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	function goToFinance()      { goto(resolve('/app/cFinance')); }
	function goToWeather()      { goto(resolve('/app/rWeatherInt')); }
	function goToOptimization() { goto(resolve('/app/sProfOpt')); }

	// Placeholder KPI data — replace with real data from your backend
	const kpis = [
		{ label: 'Net Cash Position', value: '$84,320',  delta: '+4.2%',  up: true  },
		{ label: 'Herd Valuation',    value: '$412,800', delta: '+1.8%',  up: true  },
		{ label: 'YTD Income',        value: '$198,500', delta: '+12.4%', up: true  },
		{ label: 'YTD Expenses',      value: '$114,180', delta: '+3.1%',  up: false },
	];

	const quickLinks = [
		{
			icon: '📊',
			title: 'Core Finance',
			desc: 'Track income, expenses, and your operation\'s overall financial health.',
			action: goToFinance,
			tag: 'Phase 1'
		},
		{
			icon: '🌦️',
			title: 'Weather Intelligence',
			desc: 'Region-specific alerts, drought monitors, and storm risk for your land.',
			action: goToWeather,
			tag: 'Phase 2'
		},
		{
			icon: '📈',
			title: 'Profit Optimization',
			desc: 'Medium-term projections and recommendations to maximize your margins.',
			action: goToOptimization,
			tag: 'Phase 1'
		},
	];

	const recommendations = [
		{ icon: '💡', text: 'Feeder prices are up 8% this week. Consider an early Q4 sale for optimal margin.' },
		{ icon: '⚠️', text: 'Drought watch issued for your region. Review your hay reserves and insurance coverage.' },
		{ icon: '📅', text: 'Q3 expense report is ready. Log in to Core Finance to review your cost breakdown.' },
	];

	// Placeholder chart data — replace with real figures
	const bars   = [42, 58, 51, 74, 66, 88];
	const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
	});
</script>

<svelte:head>
	<title>Home — Moonance</title>
</svelte:head>

<div class="page">

	<!-- ── GREETING HEADER ── -->
	<header class="page-header">
		<div>
			<div class="eyebrow">Good morning</div>
			<h1 class="page-title">Your Operation at a Glance</h1>
		</div>
		<span class="date-mono">{today}</span>
	</header>

	<!-- ── KPI CARDS ── -->
	<section class="section">
		<div class="section-label">Financial Snapshot</div>
		<div class="kpi-grid">
			{#each kpis as k}
				<div class="kpi-card">
					<div class="kpi-label">{k.label}</div>
					<div class="kpi-value">{k.value}</div>
					<div class="kpi-delta" class:up={k.up} class:down={!k.up}>
						{k.up ? '▲' : '▼'} {k.delta} vs last period
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── CHART + RECOMMENDATIONS ── -->
	<section class="section mid-grid">

		<div class="chart-card">
			<div class="section-label">6-Month Profit Trend</div>
			<div class="chart-area">
				<div class="chart-bars">
					{#each bars as h, i}
						<div class="bar-wrap">
							<div class="bar" style="height:{h}%; animation-delay:{i * 0.08}s"></div>
							<div class="bar-label">{months[i]}</div>
						</div>
					{/each}
				</div>
			</div>
			<span class="chart-note">All figures in USD · Placeholder data</span>
		</div>

		<div class="reco-card">
			<div class="section-label">Recommendations</div>
			<div class="reco-list">
				{#each recommendations as r}
					<div class="reco-item">
						<span class="reco-icon">{r.icon}</span>
						<span class="reco-text">{r.text}</span>
					</div>
				{/each}
			</div>
		</div>

	</section>

	<!-- ── QUICK LINKS ── -->
	<section class="section">
		<div class="section-label">Jump To</div>
		<div class="links-grid">
			{#each quickLinks as link}
				<button class="link-card" onclick={link.action}>
					<div class="link-top">
						<span class="link-icon">{link.icon}</span>
						<span class="link-tag">{link.tag}</span>
					</div>
					<div class="link-title">{link.title}</div>
					<div class="link-desc">{link.desc}</div>
					<div class="link-arrow">→</div>
				</button>
			{/each}
		</div>
	</section>

</div>

<style>
	/* ── TOKENS ── */
	:root {
		--soil:  #0F0A04;
		--earth: #1C1208;
		--bark:  #2E1E0A;
		--rust:  #C4541A;
		--amber: #D4922A;
		--wheat: #E8C87A;
		--cream: #F0E8D5;
		--muted: #8A7A62;
		--green: #5A9E5A;
		--red:   #C44040;
	}

	/* ── PAGE ── */
	.page {
		display: flex;
		flex-direction: column;
		gap: 40px;
		max-width: 1100px;
	}

	/* ── HEADER ── */
	.page-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(212,146,42,.12);
	}
	.eyebrow {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		letter-spacing: .18em;
		text-transform: uppercase;
		color: var(--amber);
		margin-bottom: 6px;
	}
	.page-title {
		font-family: 'Lora', serif;
		font-size: clamp(22px, 3vw, 34px);
		font-weight: 700;
		color: var(--cream);
		line-height: 1.1;
	}
	.date-mono {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: .04em;
	}

	/* ── SECTION ── */
	.section { display: flex; flex-direction: column; gap: 14px; }
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: .18em;
		text-transform: uppercase;
		color: var(--amber);
	}

	/* ── KPI GRID ── */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 14px;
	}
	.kpi-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px;
		padding: 20px 18px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: border-color .2s, transform .2s;
	}
	.kpi-card:hover {
		border-color: rgba(212,146,42,.3);
		transform: translateY(-2px);
	}
	.kpi-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: .1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.kpi-value {
		font-family: 'Lora', serif;
		font-size: 26px;
		font-weight: 700;
		color: var(--cream);
		line-height: 1;
	}
	.kpi-delta {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
	}
	.kpi-delta.up   { color: var(--green); }
	.kpi-delta.down { color: var(--red);   }

	/* ── MID GRID ── */
	.mid-grid {
		display: grid !important;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		flex-direction: unset !important;
	}

	/* ── CHART ── */
	.chart-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px;
		padding: 22px 20px 16px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.chart-area {
		flex: 1;
		height: 140px;
		display: flex;
		align-items: flex-end;
	}
	.chart-bars {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		width: 100%;
		height: 100%;
	}
	.bar-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		gap: 6px;
	}
	.bar {
		width: 100%;
		background: linear-gradient(180deg, var(--rust) 0%, var(--amber) 100%);
		border-radius: 3px 3px 0 0;
		transform: scaleY(0);
		transform-origin: bottom;
		animation: growBar .7s cubic-bezier(.22,.68,0,1.2) forwards;
	}
	@keyframes growBar { to { transform: scaleY(1); } }
	.bar-label {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		color: var(--muted);
	}
	.chart-note {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		color: rgba(138,122,98,.4);
		text-align: right;
	}

	/* ── RECOMMENDATIONS ── */
	.reco-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px;
		padding: 22px 20px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.reco-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.reco-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 13px;
		background: rgba(212,146,42,.04);
		border: 1px solid rgba(212,146,42,.1);
		border-radius: 6px;
	}
	.reco-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
	.reco-text {
		font-size: 13px;
		line-height: 1.6;
		color: var(--muted);
	}

	/* ── QUICK LINKS ── */
	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 14px;
	}
	.link-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px;
		padding: 22px 20px;
		cursor: pointer;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: border-color .2s, transform .2s, background .2s;
		width: 100%;
		color: inherit;
	}
	.link-card:hover {
		border-color: rgba(212,146,42,.35);
		background: rgba(212,146,42,.04);
		transform: translateY(-3px);
	}
	.link-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.link-icon { font-size: 20px; }
	.link-tag {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		letter-spacing: .1em;
		text-transform: uppercase;
		color: var(--amber);
		background: rgba(212,146,42,.1);
		border: 1px solid rgba(212,146,42,.2);
		padding: 3px 8px;
		border-radius: 3px;
	}
	.link-title {
		font-family: 'Lora', serif;
		font-size: 16px;
		font-weight: 600;
		color: var(--wheat);
	}
	.link-desc {
		font-size: 13px;
		line-height: 1.65;
		color: var(--muted);
		flex: 1;
	}
	.link-arrow {
		font-size: 17px;
		color: var(--rust);
		transition: transform .2s;
	}
	.link-card:hover .link-arrow { transform: translateX(4px); }

	/* ── RESPONSIVE ── */
	@media (max-width: 700px) {
		.mid-grid { grid-template-columns: 1fr !important; }
	}
</style>