<script lang="ts">
	import { getFinanceOverview } from './overview.remote';

	let data = $state(await getFinanceOverview());

	let incomeEntries = $derived(data.incomeEntries);
	let expenseEntries = $derived(data.expenseEntries);

	let totalIncome = $derived(incomeEntries.reduce((s, e) => s + e.amount, 0));
	let totalExpenses = $derived(expenseEntries.reduce((s, e) => s + e.amount, 0));
	let netProfit = $derived(totalIncome - totalExpenses);
	let margin = $derived(totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '—');

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}
</script>

<svelte:head>
	<title>Core Finance — Moonance</title>
</svelte:head>

<div class="kpi-grid">
	<div class="kpi-card">
		<div class="kpi-label">Total Income</div>
		<div class="kpi-value" class:green={totalIncome > 0} class:dim={totalIncome === 0}>
			{fmt(totalIncome)}
		</div>
		<div class="kpi-sub">
			{incomeEntries.length}
			{incomeEntries.length === 1 ? 'entry' : 'entries'}
		</div>
	</div>

	<div class="kpi-card">
		<div class="kpi-label">Total Expenses</div>
		<div class="kpi-value" class:red={totalExpenses > 0} class:dim={totalExpenses === 0}>
			{fmt(totalExpenses)}
		</div>
		<div class="kpi-sub">
			{expenseEntries.length}
			{expenseEntries.length === 1 ? 'entry' : 'entries'}
		</div>
	</div>

	<div class="kpi-card">
		<div class="kpi-label">Net Profit</div>
		<div
			class="kpi-value"
			class:green={netProfit > 0}
			class:red={netProfit < 0}
			class:dim={netProfit === 0}
		>
			{fmt(netProfit)}
		</div>
		<div class="kpi-sub">Margin: {margin}{margin !== '—' ? '%' : ''}</div>
	</div>
</div>

<div class="action-grid">
	<a href="/app/finance/income" class="action-card">
		<div class="action-icon">💰</div>
		<div class="action-label">Log Income</div>
		<div class="action-desc">
			Record a livestock sale, crop sale, government payment, or other income.
		</div>
		<div class="action-arrow">→</div>
	</a>

	<a href="/app/finance/expenses" class="action-card">
		<div class="action-icon">🧾</div>
		<div class="action-label">Log Expense</div>
		<div class="action-desc">
			Record feed, fuel, vet costs, labor, equipment, or other expenses.
		</div>
		<div class="action-arrow">→</div>
	</a>

	<a href="/app/finance/bioAssets" class="action-card">
		<div class="action-icon">🐄</div>
		<div class="action-label">Manage Bio Assets</div>
		<div class="action-desc">Track and maintain your herd, crops, and other biological assets.</div>
		<div class="action-arrow">→</div>
	</a>

	<a href="/app/finance/projections" class="action-card">
		<div class="action-icon">📈</div>
		<div class="action-label">View Projections</div>
		<div class="action-desc">
			See 6-month profitability forecasts and profit maximization recommendations.
		</div>
		<div class="action-arrow">→</div>
	</a>
</div>

<style>
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 14px;
		margin-bottom: 24px;
	}

	.kpi-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 20px 18px;
		display: flex;
		flex-direction: column;
		gap: 7px;
		transition:
			border-color 0.2s,
			transform 0.2s;
	}

	.kpi-card:hover {
		border-color: rgba(212, 146, 42, 0.3);
		transform: translateY(-2px);
	}

	.kpi-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
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

	.kpi-sub {
		font-size: 11px;
		color: var(--muted);
		font-family: 'DM Mono', monospace;
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 14px;
	}

	.action-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 22px 18px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 8px;
		text-decoration: none;
		transition:
			border-color 0.2s,
			transform 0.2s,
			background 0.2s;
	}

	.action-card:hover {
		border-color: rgba(212, 146, 42, 0.3);
		background: rgba(212, 146, 42, 0.04);
		transform: translateY(-2px);
	}

	.action-icon {
		font-size: 22px;
	}

	.action-label {
		font-family: 'Lora', serif;
		font-size: 15px;
		font-weight: 600;
		color: var(--wheat);
	}

	.action-desc {
		font-size: 12px;
		color: var(--muted);
		line-height: 1.6;
		flex: 1;
	}

	.action-arrow {
		color: var(--rust);
		font-size: 16px;
		transition: transform 0.18s;
	}

	.action-card:hover .action-arrow {
		transform: translateX(4px);
	}

	.green {
		color: var(--green) !important;
	}

	.red {
		color: var(--red) !important;
	}

	.amber {
		color: var(--amber) !important;
	}

	.dim {
		color: var(--muted) !important;
	}

	@media (max-width: 640px) {
		.kpi-grid {
			grid-template-columns: 1fr 1fr;
		}

		.action-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
