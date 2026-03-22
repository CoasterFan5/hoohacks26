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

<style lang="scss">
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-bottom: 24px;
	}

	.kpi-card {
		background: rgba(30, 30, 30, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: background 0.2s;

		&:hover {
			background: rgba(40, 40, 40, 0.6);
		}
	}

	.kpi-label {
		font-size: 13px;
		color: var(--muted, #a0a0a0);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.kpi-value {
		font-size: 32px;
		font-weight: 500;
		color: var(--cream, #f0f0f0);
		font-family: 'DM Mono', monospace;

		&.green {
			color: #4ade80;
		}
		&.red {
			color: #f87171;
		}
		&.amber {
			color: #fbbf24;
		}
		&.dim {
			color: #6b7280;
			opacity: 0.5;
		}
	}

	.kpi-sub {
		font-size: 13px;
		color: var(--muted, #a0a0a0);
	}
</style>
