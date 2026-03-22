<script lang="ts">
	// ── TYPES ──────────────────────────────────────────────
	interface MonthProjection {
		month: string;
		income: number;
		expenses: number;
		profit: number;
		margin: number;
		herdContribution: number;
	}

	interface Recommendation {
		id: number;
		icon: string;
		priority: 'High' | 'Medium' | 'Low';
		category: string;
		title: string;
		body: string;
		estimatedImpact: string;
		impactDir: 'positive' | 'neutral';
	}

	interface HerdSnapshot {
		breed: string;
		head: number;
		currentValue: number;
		projectedValue: number;
		recommendedAction: string;
		actionTag: 'sell' | 'hold' | 'expand' | 'monitor';
	}

	// ── TABS ───────────────────────────────────────────────
	let activeTab = $state<'overview' | 'projections' | 'recommendations' | 'herd'>('overview');

	const tabs = [
		{ key: 'overview',        label: 'Overview'         },
		{ key: 'projections',     label: 'Projections'      },
		{ key: 'recommendations', label: 'Recommendations'  },
		{ key: 'herd',            label: 'Herd & Valuation' },
	] as const;

	// ── PROJECTION DATA (placeholder) ─────────────────────
	const projections: MonthProjection[] = [
		{ month: 'Nov', income: 22_000, expenses: 10_200, profit: 11_800, margin: 53.6, herdContribution: 14_200 },
		{ month: 'Dec', income: 18_500, expenses:  9_800, profit:  8_700, margin: 47.0, herdContribution: 14_050 },
		{ month: 'Jan', income: 15_200, expenses:  8_900, profit:  6_300, margin: 41.4, herdContribution: 13_800 },
		{ month: 'Feb', income: 16_800, expenses:  9_400, profit:  7_400, margin: 44.0, herdContribution: 13_900 },
		{ month: 'Mar', income: 24_400, expenses: 11_100, profit: 13_300, margin: 54.5, herdContribution: 15_200 },
		{ month: 'Apr', income: 31_000, expenses: 13_200, profit: 17_800, margin: 57.4, herdContribution: 17_600 },
	];

	const projMax = Math.max(...projections.map(p => p.income));

	// Rolling 6-month totals
	const totalProjectedIncome   = projections.reduce((s, p) => s + p.income, 0);
	const totalProjectedExpenses = projections.reduce((s, p) => s + p.expenses, 0);
	const totalProjectedProfit   = projections.reduce((s, p) => s + p.profit, 0);
	const avgMargin              = (projections.reduce((s, p) => s + p.margin, 0) / projections.length).toFixed(1);
	const bestMonth              = projections.reduce((best, p) => p.profit > best.profit ? p : best);
	const worstMonth             = projections.reduce((worst, p) => p.profit < worst.profit ? p : worst);

	// ── RECOMMENDATIONS (placeholder) ────────────────────
	const recommendations: Recommendation[] = [
		{
			id: 1,
			icon: '💰',
			priority: 'High',
			category: 'Sell Timing',
			title: 'Sell feeder steers before December',
			body: 'Feeder steer prices on CME are at a 6-month high and seasonal data suggests a 6–10% softening through Jan–Feb. Moving 10–15 head now locks in favorable prices before the winter dip.',
			estimatedImpact: '+$2,800–$4,200 vs. Jan sale',
			impactDir: 'positive'
		},
		{
			id: 2,
			icon: '🌾',
			priority: 'High',
			category: 'Feed Costs',
			title: 'Pre-buy hay before December price spike',
			body: 'Hay prices in your region historically rise 15–22% between November and February due to demand and supply constraints. Purchasing 60–90 days of reserves now could significantly reduce your Q1 feed spend.',
			estimatedImpact: 'Save est. $1,100–$1,800 in Q1',
			impactDir: 'positive'
		},
		{
			id: 3,
			icon: '📅',
			priority: 'Medium',
			category: 'Cash Flow',
			title: 'Stage income to cover Q1 cash-flow dip',
			body: 'Projections show your lowest income months are Jan–Feb. Consider timing a cattle or crop sale in late October or early November to build a cash buffer before the slow period.',
			estimatedImpact: 'Reduces liquidity risk in Jan–Feb',
			impactDir: 'positive'
		},
		{
			id: 4,
			icon: '🐄',
			priority: 'Medium',
			category: 'Herd Management',
			title: 'Hold breeding cows through Q1 for spring calving',
			body: 'Your breeding cow group is approaching peak reproductive value heading into spring calving season. Selling now would forfeit the calf crop value. Hold through April for maximum ROI.',
			estimatedImpact: 'Protects est. $17,600 in Q2 calf value',
			impactDir: 'positive'
		},
		{
			id: 5,
			icon: '⛽',
			priority: 'Medium',
			category: 'Operating Costs',
			title: 'Audit fuel and equipment expenses',
			body: 'Fuel and equipment combined represent an estimated 18% of your total expenses. Consolidating trips, scheduling preventative maintenance before spring, and reviewing equipment idle time could reduce this category meaningfully.',
			estimatedImpact: 'Potential 8–12% reduction in fuel/equip costs',
			impactDir: 'positive'
		},
		{
			id: 6,
			icon: '📊',
			priority: 'Low',
			category: 'Benchmarking',
			title: 'Your projected margin outperforms regional average',
			body: 'Your 6-month average projected margin of ' + avgMargin + '% compares favorably to the regional benchmark of approximately 32–36% for operations of similar size. Maintaining current cost discipline is the primary lever.',
			estimatedImpact: 'Sustain current trajectory',
			impactDir: 'neutral'
		},
	];

	// ── HERD SNAPSHOTS (placeholder) ──────────────────────
	const herdSnapshots: HerdSnapshot[] = [
		{
			breed: 'Angus Steers (42 head)',
			head: 42,
			currentValue: 65_058,
			projectedValue: 60_200,
			recommendedAction: 'Sell now — prices projected to soften 7% by January',
			actionTag: 'sell'
		},
		{
			breed: 'Angus Heifers (28 head)',
			head: 28,
			currentValue: 38_220,
			projectedValue: 40_100,
			recommendedAction: 'Hold — value projected to rise 5% through spring',
			actionTag: 'hold'
		},
		{
			breed: 'Brahman Cross (15 head)',
			head: 15,
			currentValue: 23_184,
			projectedValue: 24_000,
			recommendedAction: 'Hold and monitor — stable market for this class',
			actionTag: 'monitor'
		},
		{
			breed: 'Breeding Cows (35 head)',
			head: 35,
			currentValue: 58_800,
			projectedValue: 66_000,
			recommendedAction: 'Expand if possible — spring calf crop projects strong Q2 return',
			actionTag: 'expand'
		},
	];

	const totalCurrentValue   = herdSnapshots.reduce((s, h) => s + h.currentValue, 0);
	const totalProjectedValue = herdSnapshots.reduce((s, h) => s + h.projectedValue, 0);
	const herdDelta           = totalProjectedValue - totalCurrentValue;

	// ── HELPERS ───────────────────────────────────────────
	function fmt(n: number) {
		return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}

	function actionClass(tag: string) {
		switch (tag) {
			case 'sell':    return 'tag-sell';
			case 'hold':    return 'tag-hold';
			case 'expand':  return 'tag-expand';
			case 'monitor': return 'tag-monitor';
			default:        return '';
		}
	}

	function actionLabel(tag: string) {
		switch (tag) {
			case 'sell':    return '📤 Sell';
			case 'hold':    return '✋ Hold';
			case 'expand':  return '📈 Expand';
			case 'monitor': return '👁 Monitor';
			default:        return tag;
		}
	}

	// Chart bar heights as % of max
	function barH(val: number) { return Math.max((val / projMax) * 100, 3); }
</script>

<svelte:head>
	<title>Profit Optimization — Moonance</title>
</svelte:head>

<div class="page">

	<!-- ── PAGE HEADER ── -->
	<header class="page-header">
		<div>
			<div class="eyebrow">Phase 1 · Strategic Profit Optimization</div>
			<h1 class="page-title">Profit Optimization</h1>
		</div>
		<div class="disclaimer-badge">⚠ Placeholder data</div>
	</header>

	<!-- ── TABS ── -->
	<div class="tabs">
		{#each tabs as t}
			<button
				class="tab"
				class:active={activeTab === t.key}
				onclick={() => activeTab = t.key}
			>{t.label}</button>
		{/each}
	</div>

	<!-- ════════════════════════════════════ -->
	<!--  OVERVIEW                           -->
	<!-- ════════════════════════════════════ -->
	{#if activeTab === 'overview'}

		<!-- Summary KPIs -->
		<div class="kpi-grid">
			<div class="kpi-card">
				<div class="kpi-label">6-Month Proj. Income</div>
				<div class="kpi-value green">{fmt(totalProjectedIncome)}</div>
				<div class="kpi-sub">Nov → Apr</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-label">6-Month Proj. Expenses</div>
				<div class="kpi-value red">{fmt(totalProjectedExpenses)}</div>
				<div class="kpi-sub">Nov → Apr</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-label">6-Month Proj. Profit</div>
				<div class="kpi-value" class:green={totalProjectedProfit >= 0} class:red={totalProjectedProfit < 0}>
					{fmt(totalProjectedProfit)}
				</div>
				<div class="kpi-sub">Avg margin: {avgMargin}%</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-label">Herd Value (6-Mo Proj.)</div>
				<div class="kpi-value amber">{fmt(totalProjectedValue)}</div>
				<div class="kpi-sub" class:green={herdDelta >= 0} class:red={herdDelta < 0}>
					{herdDelta >= 0 ? '▲' : '▼'} {fmt(herdDelta)} vs today
				</div>
			</div>
		</div>

		<!-- Mini chart -->
		<div class="card">
			<div class="section-label">6-Month Profit Trend at a Glance</div>
			<div class="overview-chart">
				{#each projections as p}
					<div class="ov-col">
						<div class="ov-bars">
							<div class="ov-bar income-bar"  style="height:{barH(p.income)}%"   title="Income: {fmt(p.income)}"></div>
							<div class="ov-bar expense-bar" style="height:{barH(p.expenses)}%" title="Expenses: {fmt(p.expenses)}"></div>
							<div class="ov-bar profit-bar"  style="height:{barH(p.profit)}%"   title="Profit: {fmt(p.profit)}"></div>
						</div>
						<div class="ov-month">{p.month}</div>
					</div>
				{/each}
			</div>
			<div class="chart-legend">
				<span class="legend-dot dot-income"></span><span>Income</span>
				<span class="legend-dot dot-expense"></span><span>Expenses</span>
				<span class="legend-dot dot-profit"></span><span>Profit</span>
			</div>
		</div>

		<!-- Best / worst callout -->
		<div class="callout-row">
			<div class="callout callout-best">
				<div class="callout-label">Best Month</div>
				<div class="callout-month">{bestMonth.month}</div>
				<div class="callout-val green">{fmt(bestMonth.profit)}</div>
				<div class="callout-sub">{bestMonth.margin}% margin</div>
			</div>
			<div class="callout callout-worst">
				<div class="callout-label">Watch Month</div>
				<div class="callout-month">{worstMonth.month}</div>
				<div class="callout-val amber">{fmt(worstMonth.profit)}</div>
				<div class="callout-sub">{worstMonth.margin}% margin — plan ahead</div>
			</div>
			<div class="callout callout-reco">
				<div class="callout-label">Top Recommendation</div>
				<div class="callout-reco-text">{recommendations[0].title}</div>
				<div class="callout-impact green">{recommendations[0].estimatedImpact}</div>
				<button class="link-btn" onclick={() => activeTab = 'recommendations'}>See all recommendations →</button>
			</div>
		</div>

		<div class="notice">
			⚠ All figures are placeholder projections. Connect your backend to generate real forecasts from your logged income, expenses, and herd data.
		</div>

	<!-- ════════════════════════════════════ -->
	<!--  PROJECTIONS                        -->
	<!-- ════════════════════════════════════ -->
	{:else if activeTab === 'projections'}

		<!-- Full chart -->
		<div class="card">
			<div class="section-label">6-Month Profitability Projection — Nov through Apr</div>
			<div class="proj-chart">
				{#each projections as p}
					<div class="proj-col">
						<div class="proj-profit-label" class:green={p.profit >= 0} class:red={p.profit < 0}>
							{fmt(p.profit)}
						</div>
						<div class="proj-bars">
							<div
								class="proj-bar income-bar"
								style="height:{barH(p.income)}%; animation-delay:{projections.indexOf(p) * 0.07}s"
								title="Income: {fmt(p.income)}"
							></div>
							<div
								class="proj-bar expense-bar"
								style="height:{barH(p.expenses)}%; animation-delay:{projections.indexOf(p) * 0.07 + 0.03}s"
								title="Expenses: {fmt(p.expenses)}"
							></div>
						</div>
						<div class="proj-month">{p.month}</div>
					</div>
				{/each}
			</div>
			<div class="chart-legend">
				<span class="legend-dot dot-income"></span><span>Projected Income</span>
				<span class="legend-dot dot-expense"></span><span>Projected Expenses</span>
			</div>
		</div>

		<!-- Monthly table -->
		<div class="card">
			<div class="section-label">Monthly Breakdown</div>
			<table class="data-table">
				<thead>
					<tr>
						<th>Month</th>
						<th>Proj. Income</th>
						<th>Proj. Expenses</th>
						<th>Net Profit</th>
						<th>Margin</th>
						<th>Herd Contribution</th>
					</tr>
				</thead>
				<tbody>
					{#each projections as p}
						<tr class:best-row={p.month === bestMonth.month} class:warn-row={p.month === worstMonth.month}>
							<td class="bold">{p.month}</td>
							<td class="mono green">+{fmt(p.income)}</td>
							<td class="mono red">−{fmt(p.expenses)}</td>
							<td class="mono" class:green={p.profit >= 0} class:red={p.profit < 0}>{fmt(p.profit)}</td>
							<td class="mono muted">{p.margin}%</td>
							<td class="mono amber">{fmt(p.herdContribution)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td class="bold">6-Mo Total</td>
						<td class="mono green bold">+{fmt(totalProjectedIncome)}</td>
						<td class="mono red bold">−{fmt(totalProjectedExpenses)}</td>
						<td class="mono green bold">{fmt(totalProjectedProfit)}</td>
						<td class="mono muted bold">{avgMargin}%</td>
						<td class="mono muted">—</td>
					</tr>
				</tfoot>
			</table>
			<div class="table-legend">
				<span class="row-tag best-tag">Best month</span>
				<span class="row-tag warn-tag">Watch month — plan cash buffer</span>
			</div>
		</div>

		<div class="notice">
			⚠ Herd contribution reflects estimated livestock market value change per month. Placeholder data — connect your backend for real figures.
		</div>

	<!-- ════════════════════════════════════ -->
	<!--  RECOMMENDATIONS                    -->
	<!-- ════════════════════════════════════ -->
	{:else if activeTab === 'recommendations'}

		<div class="reco-summary">
			<span class="reco-count">{recommendations.filter(r => r.priority === 'High').length} High priority</span>
			<span class="reco-count-sep">·</span>
			<span class="reco-count">{recommendations.filter(r => r.priority === 'Medium').length} Medium priority</span>
			<span class="reco-count-sep">·</span>
			<span class="reco-count">{recommendations.filter(r => r.priority === 'Low').length} Low priority</span>
		</div>

		<div class="reco-list">
			{#each recommendations as r}
				<div class="reco-card priority-border-{r.priority.toLowerCase()}">
					<div class="reco-header">
						<div class="reco-title-row">
							<span class="reco-icon">{r.icon}</span>
							<div>
								<div class="reco-category">{r.category}</div>
								<div class="reco-title">{r.title}</div>
							</div>
						</div>
						<span class="priority-badge priority-{r.priority.toLowerCase()}">{r.priority}</span>
					</div>
					<div class="reco-body">{r.body}</div>
					<div class="reco-impact" class:impact-positive={r.impactDir === 'positive'} class:impact-neutral={r.impactDir === 'neutral'}>
						<span class="impact-label">Est. Impact:</span>
						<span class="impact-val">{r.estimatedImpact}</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="notice">
			⚠ Recommendations are generated from placeholder data and regional benchmarks. Connect your Core Finance data to receive recommendations tailored to your actual operation.
		</div>

	<!-- ════════════════════════════════════ -->
	<!--  HERD & VALUATION                   -->
	<!-- ════════════════════════════════════ -->
	{:else if activeTab === 'herd'}

		<div class="kpi-grid">
			<div class="kpi-card">
				<div class="kpi-label">Current Herd Value</div>
				<div class="kpi-value amber">{fmt(totalCurrentValue)}</div>
				<div class="kpi-sub">Based on today's market prices</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-label">Projected Value (6 Mo)</div>
				<div class="kpi-value amber">{fmt(totalProjectedValue)}</div>
				<div class="kpi-sub">Based on seasonal price trends</div>
			</div>
			<div class="kpi-card">
				<div class="kpi-label">Projected Delta</div>
				<div class="kpi-value" class:green={herdDelta >= 0} class:red={herdDelta < 0}>
					{herdDelta >= 0 ? '+' : '−'}{fmt(herdDelta)}
				</div>
				<div class="kpi-sub">{herdDelta >= 0 ? '▲ Value trending up' : '▼ Value trending down'}</div>
			</div>
		</div>

		<!-- Herd group cards -->
		<div class="herd-grid">
			{#each herdSnapshots as h}
				<div class="herd-card">
					<div class="herd-card-header">
						<div class="herd-breed">{h.breed}</div>
						<span class="action-tag {actionClass(h.actionTag)}">{actionLabel(h.actionTag)}</span>
					</div>
					<div class="herd-values">
						<div class="herd-val-block">
							<div class="herd-val-label">Current Value</div>
							<div class="herd-val-num amber">{fmt(h.currentValue)}</div>
						</div>
						<div class="herd-arrow">→</div>
						<div class="herd-val-block">
							<div class="herd-val-label">6-Mo Projected</div>
							<div class="herd-val-num" class:green={h.projectedValue >= h.currentValue} class:red={h.projectedValue < h.currentValue}>
								{fmt(h.projectedValue)}
							</div>
						</div>
						<div class="herd-delta" class:green={h.projectedValue >= h.currentValue} class:red={h.projectedValue < h.currentValue}>
							{h.projectedValue >= h.currentValue ? '▲' : '▼'}
							{fmt(Math.abs(h.projectedValue - h.currentValue))}
						</div>
					</div>
					<div class="herd-action-text">{h.recommendedAction}</div>
				</div>
			{/each}
		</div>

		<!-- Value bar comparison -->
		<div class="card">
			<div class="section-label">Current vs Projected Value by Group</div>
			<div class="value-bars">
				{#each herdSnapshots as h}
					{@const maxVal = Math.max(h.currentValue, h.projectedValue)}
					<div class="value-bar-row">
						<div class="value-bar-label">{h.breed.split('(')[0].trim()}</div>
						<div class="value-bar-tracks">
							<div class="value-bar-track">
								<div class="value-bar-fill amber-bar" style="width:{(h.currentValue / totalCurrentValue) * 100}%"></div>
							</div>
							<div class="value-bar-track">
								<div
									class="value-bar-fill"
									class:green-bar={h.projectedValue >= h.currentValue}
									class:red-bar={h.projectedValue < h.currentValue}
									style="width:{(h.projectedValue / totalProjectedValue) * 100}%"
								></div>
							</div>
						</div>
						<div class="value-bar-nums">
							<span class="amber mono">{fmt(h.currentValue)}</span>
							<span class="muted mono">→</span>
							<span class="mono" class:green={h.projectedValue >= h.currentValue} class:red={h.projectedValue < h.currentValue}>{fmt(h.projectedValue)}</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="bar-legend">
				<span class="legend-dot dot-amber"></span><span>Current</span>
				<span class="legend-dot dot-income"></span><span>Projected</span>
			</div>
		</div>

		<div class="notice">
			⚠ Herd valuations and projections are placeholder figures. Update your herd data in Core Finance → Herd Value to reflect your real numbers.
		</div>

	{/if}

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
		--sage:  #6B8F5E;
		--green: #5A9E5A;
		--red:   #C44040;
	}

	/* ── PAGE ── */
	.page { display: flex; flex-direction: column; gap: 24px; max-width: 1000px; }

	/* ── HEADER ── */
	.page-header {
		display: flex; align-items: flex-end; justify-content: space-between;
		flex-wrap: wrap; gap: 12px;
		padding-bottom: 24px; border-bottom: 1px solid rgba(212,146,42,.12);
	}
	.eyebrow {
		font-family: 'DM Mono', monospace; font-size: 11px;
		letter-spacing: .18em; text-transform: uppercase; color: var(--amber); margin-bottom: 6px;
	}
	.page-title {
		font-family: 'Lora', serif; font-size: clamp(22px, 3vw, 32px);
		font-weight: 700; color: var(--cream); line-height: 1.1;
	}
	.disclaimer-badge {
		font-family: 'DM Mono', monospace; font-size: 10px;
		color: var(--amber); background: rgba(212,146,42,.08);
		border: 1px solid rgba(212,146,42,.2);
		padding: 5px 12px; border-radius: 4px; letter-spacing: .08em;
	}

	/* ── TABS ── */
	.tabs {
		display: flex; gap: 2px;
		border-bottom: 1px solid rgba(212,146,42,.12); flex-wrap: wrap;
	}
	.tab {
		background: none; border: none;
		border-bottom: 2px solid transparent;
		padding: 10px 18px; margin-bottom: -1px;
		font-family: 'DM Sans', sans-serif; font-size: 14px;
		color: var(--muted); cursor: pointer;
		transition: color .18s, border-color .18s;
	}
	.tab:hover  { color: var(--cream); }
	.tab.active { color: var(--wheat); border-bottom-color: var(--amber); }

	/* ── SECTION LABEL ── */
	.section-label {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .18em; text-transform: uppercase; color: var(--amber);
	}

	/* ── CARD ── */
	.card {
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 24px;
		display: flex; flex-direction: column; gap: 18px;
	}

	/* ── KPI GRID ── */
	.kpi-grid {
		display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;
	}
	.kpi-card {
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 20px 18px;
		display: flex; flex-direction: column; gap: 7px;
		transition: border-color .2s, transform .2s;
	}
	.kpi-card:hover { border-color: rgba(212,146,42,.3); transform: translateY(-2px); }
	.kpi-label {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
	}
	.kpi-value { font-family: 'Lora', serif; font-size: 26px; font-weight: 700; color: var(--cream); line-height: 1; }
	.kpi-sub   { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--muted); }

	/* ── OVERVIEW MINI CHART ── */
	.overview-chart {
		display: flex; align-items: flex-end; gap: 10px; height: 120px;
	}
	.ov-col {
		flex: 1; display: flex; flex-direction: column;
		align-items: center; gap: 7px; height: 100%; justify-content: flex-end;
	}
	.ov-bars {
		display: flex; gap: 3px; align-items: flex-end;
		height: calc(100% - 20px); width: 100%;
	}
	.ov-bar {
		flex: 1; border-radius: 2px 2px 0 0;
		transform: scaleY(0); transform-origin: bottom;
		animation: growBar .6s cubic-bezier(.22,.68,0,1.2) forwards;
	}
	.ov-month { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); }

	/* ── FULL PROJ CHART ── */
	.proj-chart {
		display: flex; align-items: flex-end; gap: 14px; height: 180px; padding: 0 4px;
	}
	.proj-col {
		flex: 1; display: flex; flex-direction: column;
		align-items: center; gap: 6px; height: 100%; justify-content: flex-end;
	}
	.proj-profit-label {
		font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 600;
	}
	.proj-bars {
		display: flex; gap: 4px; align-items: flex-end;
		height: calc(100% - 44px); width: 100%;
	}
	.proj-bar {
		flex: 1; border-radius: 3px 3px 0 0;
		transform: scaleY(0); transform-origin: bottom;
		animation: growBar .7s cubic-bezier(.22,.68,0,1.2) forwards;
	}
	.proj-month { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }

	@keyframes growBar { to { transform: scaleY(1); } }

	/* bar colors */
	.income-bar  { background: var(--sage); }
	.expense-bar { background: var(--rust); opacity: .8; }
	.profit-bar  { background: var(--amber); }
	.amber-bar   { background: var(--amber); }
	.green-bar   { background: var(--green); }
	.red-bar     { background: var(--red); }

	/* ── CHART LEGEND ── */
	.chart-legend {
		display: flex; align-items: center; gap: 16px;
		font-size: 12px; color: var(--muted); flex-wrap: wrap;
	}
	.legend-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
	.dot-income  { background: var(--sage); }
	.dot-expense { background: var(--rust); }
	.dot-profit  { background: var(--amber); }
	.dot-amber   { background: var(--amber); }

	/* ── CALLOUT ROW ── */
	.callout-row { display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 14px; }
	.callout {
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 20px 18px;
		display: flex; flex-direction: column; gap: 6px;
	}
	.callout-best   { border-top: 3px solid var(--green); }
	.callout-worst  { border-top: 3px solid var(--amber); }
	.callout-reco   { border-top: 3px solid var(--rust); }
	.callout-label  { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); }
	.callout-month  { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--cream); }
	.callout-val    { font-family: 'Lora', serif; font-size: 22px; font-weight: 700; }
	.callout-sub    { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }
	.callout-reco-text { font-size: 14px; font-weight: 500; color: var(--wheat); line-height: 1.4; }
	.callout-impact    { font-size: 12px; font-family: 'DM Mono', monospace; }

	.link-btn {
		background: none; border: none; cursor: pointer;
		color: var(--amber); font-size: 12px;
		font-family: 'DM Mono', monospace;
		text-decoration: underline; text-underline-offset: 3px;
		padding: 0; margin-top: 4px; text-align: left;
		transition: color .18s;
	}
	.link-btn:hover { color: var(--wheat); }

	/* ── DATA TABLE ── */
	.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
	.data-table th {
		text-align: left; padding: 8px 12px;
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .1em; text-transform: uppercase;
		color: var(--muted); border-bottom: 1px solid rgba(212,146,42,.1);
	}
	.data-table td {
		padding: 12px 12px; color: var(--cream);
		border-bottom: 1px solid rgba(255,255,255,.04);
	}
	.data-table tr:last-child td { border-bottom: none; }
	.data-table tfoot td { border-top: 1px solid rgba(212,146,42,.18); padding-top: 14px; }
	.data-table tr:hover td { background: rgba(212,146,42,.02); }
	.best-row td { background: rgba(90,158,90,.04) !important; }
	.warn-row td { background: rgba(212,146,42,.04) !important; }

	.table-legend { display: flex; gap: 16px; flex-wrap: wrap; }
	.row-tag {
		font-family: 'DM Mono', monospace; font-size: 10px;
		padding: 3px 10px; border-radius: 3px;
	}
	.best-tag { background: rgba(90,158,90,.12); color: var(--green); border: 1px solid rgba(90,158,90,.25); }
	.warn-tag { background: rgba(212,146,42,.1);  color: var(--amber); border: 1px solid rgba(212,146,42,.25); }

	/* ── RECOMMENDATIONS ── */
	.reco-summary {
		display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
		font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted);
	}
	.reco-count-sep { color: rgba(138,122,98,.3); }

	.reco-list { display: flex; flex-direction: column; gap: 14px; }
	.reco-card {
		background: var(--bark);
		border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 22px 22px;
		display: flex; flex-direction: column; gap: 12px;
		border-left-width: 4px;
	}
	.priority-border-high   { border-left-color: var(--red); }
	.priority-border-medium { border-left-color: var(--amber); }
	.priority-border-low    { border-left-color: var(--sage); }

	.reco-header {
		display: flex; align-items: flex-start;
		justify-content: space-between; gap: 14px; flex-wrap: wrap;
	}
	.reco-title-row { display: flex; align-items: flex-start; gap: 14px; }
	.reco-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
	.reco-category {
		font-family: 'DM Mono', monospace; font-size: 10px;
		letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px;
	}
	.reco-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 600; color: var(--wheat); }
	.reco-body  { font-size: 13px; color: var(--muted); line-height: 1.75; }
	.reco-impact {
		display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
		font-size: 12px; padding: 10px 14px;
		border-radius: 5px;
	}
	.impact-positive { background: rgba(90,158,90,.08); border: 1px solid rgba(90,158,90,.2); }
	.impact-neutral  { background: rgba(212,146,42,.06); border: 1px solid rgba(212,146,42,.15); }
	.impact-label {
		font-family: 'DM Mono', monospace; font-size: 9px;
		text-transform: uppercase; letter-spacing: .1em; color: var(--muted);
	}
	.impact-val { font-weight: 500; color: var(--cream); font-size: 13px; }

	.priority-badge {
		font-family: 'DM Mono', monospace; font-size: 9px;
		letter-spacing: .1em; text-transform: uppercase;
		padding: 4px 10px; border-radius: 3px; flex-shrink: 0;
	}
	.priority-high   { background: rgba(196,64,64,.15);  color: var(--red);   border: 1px solid rgba(196,64,64,.3); }
	.priority-medium { background: rgba(212,146,42,.15); color: var(--amber); border: 1px solid rgba(212,146,42,.3); }
	.priority-low    { background: rgba(107,143,94,.15); color: var(--sage);  border: 1px solid rgba(107,143,94,.3); }

	/* ── HERD TAB ── */
	.herd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
	.herd-card {
		background: var(--bark); border: 1px solid rgba(212,146,42,.12);
		border-radius: 8px; padding: 20px 20px;
		display: flex; flex-direction: column; gap: 14px;
		transition: border-color .2s, transform .2s;
	}
	.herd-card:hover { border-color: rgba(212,146,42,.3); transform: translateY(-2px); }
	.herd-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
	.herd-breed { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: var(--wheat); }

	.action-tag {
		font-family: 'DM Mono', monospace; font-size: 9px;
		letter-spacing: .1em; text-transform: uppercase;
		padding: 4px 10px; border-radius: 3px;
	}
	.tag-sell    { background: rgba(196,64,64,.15);  color: var(--red);   border: 1px solid rgba(196,64,64,.3); }
	.tag-hold    { background: rgba(212,146,42,.15); color: var(--amber); border: 1px solid rgba(212,146,42,.3); }
	.tag-expand  { background: rgba(90,158,90,.15);  color: var(--green); border: 1px solid rgba(90,158,90,.3); }
	.tag-monitor { background: rgba(127,181,200,.12); color: #7BAEC8;     border: 1px solid rgba(127,181,200,.25); }

	.herd-values {
		display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
	}
	.herd-val-block { display: flex; flex-direction: column; gap: 4px; }
	.herd-val-label { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); }
	.herd-val-num   { font-family: 'Lora', serif; font-size: 18px; font-weight: 700; }
	.herd-arrow     { color: var(--muted); font-size: 16px; flex-shrink: 0; }
	.herd-delta     { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600; margin-left: auto; }
	.herd-action-text { font-size: 12px; color: var(--muted); line-height: 1.6; border-top: 1px solid rgba(212,146,42,.1); padding-top: 12px; }

	/* ── VALUE BAR COMPARISON ── */
	.value-bars { display: flex; flex-direction: column; gap: 14px; }
	.value-bar-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
	.value-bar-label { font-size: 13px; color: var(--cream); width: 130px; flex-shrink: 0; }
	.value-bar-tracks { flex: 1; display: flex; flex-direction: column; gap: 5px; min-width: 100px; }
	.value-bar-track {
		height: 6px; background: rgba(255,255,255,.05);
		border-radius: 3px; overflow: hidden;
	}
	.value-bar-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
	.value-bar-nums {
		display: flex; align-items: center; gap: 6px;
		font-size: 12px; flex-shrink: 0;
	}
	.bar-legend {
		display: flex; align-items: center; gap: 16px;
		font-size: 12px; color: var(--muted);
	}

	/* ── NOTICE ── */
	.notice {
		font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted);
		background: rgba(212,146,42,.05); border: 1px solid rgba(212,146,42,.12);
		border-radius: 6px; padding: 12px 16px; line-height: 1.65;
	}

	/* ── UTILS ── */
	.green { color: var(--green) !important; }
	.red   { color: var(--red)   !important; }
	.amber { color: var(--amber) !important; }
	.muted { color: var(--muted); }
	.mono  { font-family: 'DM Mono', monospace; font-size: 13px; }
	.bold  { font-weight: 600; color: var(--cream); }

	/* ── RESPONSIVE ── */
	@media (max-width: 700px) {
		.callout-row { grid-template-columns: 1fr 1fr; }
		.callout-reco { grid-column: 1 / -1; }
		.kpi-grid { grid-template-columns: 1fr 1fr; }
		.value-bar-label { width: 90px; }
	}
	@media (max-width: 480px) {
		.callout-row { grid-template-columns: 1fr; }
	}
</style>