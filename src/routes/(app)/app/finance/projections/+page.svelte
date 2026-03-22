<script lang="ts">
	const projMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
	const projIncome = [22_000, 18_500, 15_200, 16_800, 24_400, 31_000];
	const projExpense = [10_200, 9_800, 8_900, 9_400, 11_100, 13_200];
	const projProfit = projIncome.map((v, i) => v - projExpense[i]);
	const projMax = Math.max(...projIncome);

	const recommendations = [
		{
			icon: '💡',
			priority: 'High',
			text: 'Feeder steer prices are at a 6-month high. Selling 10–15 head in the next 2 weeks could yield an estimated $2,800 above seasonal average.'
		},
		{
			icon: '✂️',
			priority: 'Medium',
			text: 'Feed costs typically represent the largest single expense for operations your size. Lock in hay pricing before December to reduce estimated spend by 12–18%.'
		},
		{
			icon: '📅',
			priority: 'Medium',
			text: 'Plan for a Q1 cash-flow dip — projections show reduced income Jan–Feb. Consider staging sales in Oct/Nov to build liquidity.'
		},
		{
			icon: '📊',
			priority: 'Low',
			text: 'Your projected Q2 margin of 35% is above regional average. Maintaining current herd size through spring should sustain this performance.'
		}
	];

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}
</script>

<svelte:head>
	<title>Projections — Moonance</title>
</svelte:head>

<div class="card">
	<div class="section-label">6-Month Profitability Projection</div>
	<div class="proj-chart">
		{#each projMonths as month, i}
			<div class="proj-col">
				<div class="proj-bars">
					<div
						class="proj-bar income-bar"
						style="height:{(projIncome[i] / projMax) * 100}%"
						title="Income: {fmt(projIncome[i])}"
					></div>
					<div
						class="proj-bar expense-bar"
						style="height:{(projExpense[i] / projMax) * 100}%"
						title="Expenses: {fmt(projExpense[i])}"
					></div>
				</div>
				<div class="proj-month">{month}</div>
			</div>
		{/each}
	</div>
	<div class="proj-legend">
		<span class="legend-dot income-dot"></span><span>Projected Income</span>
		<span class="legend-dot expense-dot"></span><span>Projected Expenses</span>
	</div>
</div>

<div class="card">
	<div class="section-label">Monthly Breakdown</div>
	<table class="ledger">
		<thead>
			<tr>
				<th>Month</th>
				<th>Proj. Income</th>
				<th>Proj. Expenses</th>
				<th>Net Profit</th>
				<th>Margin</th>
			</tr>
		</thead>
		<tbody>
			{#each projMonths as month, i}
				{@const profit = projProfit[i]}
				{@const mgn = ((profit / projIncome[i]) * 100).toFixed(1)}
				<tr>
					<td class="bold">{month}</td>
					<td class="mono green">+{fmt(projIncome[i])}</td>
					<td class="mono red">−{fmt(projExpense[i])}</td>
					<td class="mono" class:green={profit >= 0} class:red={profit < 0}>{fmt(profit)}</td>
					<td class="mono muted">{mgn}%</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="card">
	<div class="section-label">Profit Maximization Recommendations</div>
	<div class="reco-list">
		{#each recommendations as r}
			<div class="reco-item">
				<span class="reco-icon">{r.icon}</span>
				<div class="reco-body">
					<span class="reco-priority priority-{r.priority.toLowerCase()}">{r.priority}</span>
					<span class="reco-text">{r.text}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
	}
	.card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		margin-bottom: 20px;
	}
	.proj-chart {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 160px;
		padding: 0 4px;
	}
	.proj-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		height: 100%;
		justify-content: flex-end;
	}
	.proj-bars {
		display: flex;
		gap: 3px;
		align-items: flex-end;
		height: calc(100% - 22px);
		width: 100%;
	}
	.proj-bar {
		flex: 1;
		border-radius: 3px 3px 0 0;
		transform: scaleY(0);
		transform-origin: bottom;
		animation: growBar 0.7s cubic-bezier(0.22, 0.68, 0, 1.2) forwards;
	}
	.income-bar {
		background: var(--sage);
	}
	.expense-bar {
		background: var(--rust);
		opacity: 0.8;
	}
	@keyframes growBar {
		to {
			transform: scaleY(1);
		}
	}
	.proj-month {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		color: var(--muted);
	}
	.proj-legend {
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 12px;

		color: var(--muted);
	}
	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		display: inline-block;
	}
	.income-dot {
		background: var(--sage);
	}
	.expense-dot {
		background: var(--rust);
	}
	.ledger {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	.ledger th {
		text-align: left;
		padding: 8px 10px;
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		border-bottom: 1px solid rgba(212, 146, 42, 0.1);
	}
	.ledger td {
		padding: 11px 10px;
		color: var(--cream);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}
	.ledger tr:last-child td {
		border-bottom: none;
	}
	.ledger tr:hover td {
		background: rgba(212, 146, 42, 0.02);
	}
	.reco-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.reco-item {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 14px 16px;
		background: rgba(212, 146, 42, 0.04);
		border: 1px solid rgba(212, 146, 42, 0.1);
		border-radius: 6px;
	}
	.reco-icon {
		font-size: 16px;
		flex-shrink: 0;
		margin-top: 2px;
	}
	.reco-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.reco-priority {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 2px 8px;
		border-radius: 3px;
		width: fit-content;
	}
	.priority-high {
		background: rgba(196, 64, 64, 0.15);
		color: var(--red);
		border: 1px solid rgba(196, 64, 64, 0.3);
	}
	.priority-medium {
		background: rgba(212, 146, 42, 0.15);
		color: var(--amber);
		border: 1px solid rgba(212, 146, 42, 0.3);
	}
	.priority-low {
		background: rgba(107, 143, 94, 0.15);
		color: var(--sage);
		border: 1px solid rgba(107, 143, 94, 0.3);
	}
	.reco-text {
		font-size: 13px;
		color: var(--muted);
		line-height: 1.65;
	}
	.green {
		color: var(--green) !important;
	}
	.red {
		color: var(--red) !important;
	}
	.muted {
		color: var(--muted);
	}
	.mono {
		font-family: 'DM Mono', monospace;
		font-size: 13px;
	}
	.bold {
		font-weight: 600;
		color: var(--cream);
	}
</style>
