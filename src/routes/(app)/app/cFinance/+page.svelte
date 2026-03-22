<script lang="ts">
	const { data } = $props();

	type EntryType = 'income' | 'expense';

	interface Entry {
		id: string;
		type: EntryType;
		category: string;
		description: string;
		amount: number;
		date: string;
	}

	interface HerdGroup {
		id: string;
		breed: string;
		count: number;
		avgWeightLbs: number;
		pricePerCwt: number;
	}

	let activeTab = $state<'overview' | 'income' | 'expenses' | 'herd' | 'projections'>('overview');

	const tabs = [
		{ key: 'overview', label: 'Overview' },
		{ key: 'income', label: 'Income' },
		{ key: 'expenses', label: 'Expenses' },
		{ key: 'herd', label: 'Herd Value' },
		{ key: 'projections', label: 'Projections' }
	] as const;

	function today() {
		return new Date().toISOString().slice(0, 10);
	}

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});
	}

	const incomeCategories = [
		'Livestock Sale',
		'Crop Sale',
		'Government Payment',
		'Custom Work',
		'Insurance Payout',
		'Other'
	];

	const expenseCategories = [
		'Feed',
		'Fuel',
		'Veterinary',
		'Labor',
		'Equipment',
		'Land Lease',
		'Seed / Chemicals',
		'Insurance',
		'Other'
	];

	let incomeCategory = $state('');
	let incomeDesc = $state('');
	let incomeAmount = $state('');
	let incomeDate = $state(today());

	let expenseCategory = $state('');
	let expenseDesc = $state('');
	let expenseAmount = $state('');
	let expenseDate = $state(today());

	let newBreed = $state('');
	let newCount = $state('');
	let newWeight = $state('');
	let newPrice = $state('');

	let incomeEntries = $state<Entry[]>(data.incomeEntries ?? []);
	let expenseEntries = $state<Entry[]>(data.expenseEntries ?? []);
	let herdGroups = $state<HerdGroup[]>(data.herdGroups ?? []);

	let totalIncome = $derived(incomeEntries.reduce((s, e) => s + e.amount, 0));
	let totalExpenses = $derived(expenseEntries.reduce((s, e) => s + e.amount, 0));
	let netProfit = $derived(totalIncome - totalExpenses);
	let margin = $derived(totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '—');

	let herdValue = $derived(
		herdGroups.reduce((s, g) => s + (g.count * g.avgWeightLbs * g.pricePerCwt) / 100, 0)
	);
	let totalHead = $derived(herdGroups.reduce((s, g) => s + g.count, 0));
	let avgPerHead = $derived(totalHead > 0 ? Math.round(herdValue / totalHead) : 0);

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
</script>

<svelte:head>
	<title>Core Finance — Moonance</title>
</svelte:head>

<div class="page">
	<header class="page-header">
		<div>
			<div class="eyebrow">Core Features</div>
			<h1 class="page-title">Core Financial Management</h1>
		</div>
	</header>

	<div class="tabs">
		{#each tabs as t}
			<button class="tab" class:active={activeTab === t.key} onclick={() => (activeTab = t.key)}>
				{t.label}
			</button>
		{/each}
	</div>

	{#if activeTab === 'overview'}
		<div class="kpi-grid">
			<div class="kpi-card">
				<div class="kpi-label">Total Income</div>
				<div class="kpi-value" class:green={totalIncome > 0} class:dim={totalIncome === 0}>
					{fmt(totalIncome)}
				</div>
				<div class="kpi-sub">
					{incomeEntries.length} {incomeEntries.length === 1 ? 'entry' : 'entries'}
				</div>
			</div>

			<div class="kpi-card">
				<div class="kpi-label">Total Expenses</div>
				<div
					class="kpi-value"
					class:red={totalExpenses > 0}
					class:dim={totalExpenses === 0}
				>
					{fmt(totalExpenses)}
				</div>
				<div class="kpi-sub">
					{expenseEntries.length} {expenseEntries.length === 1 ? 'entry' : 'entries'}
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

			<div class="kpi-card">
				<div class="kpi-label">Herd Valuation</div>
				<div class="kpi-value amber">{fmt(herdValue)}</div>
				<div class="kpi-sub">{totalHead} head · {fmt(avgPerHead)}/head</div>
			</div>
		</div>

		<div class="action-grid">
			<div class="action-card" onclick={() => (activeTab = 'income')} role="button" tabindex="0">
				<div class="action-icon">💰</div>
				<div class="action-label">Log Income</div>
				<div class="action-desc">
					Record a livestock sale, crop sale, government payment, or other income.
				</div>
				<div class="action-arrow">→</div>
			</div>

			<div
				class="action-card"
				onclick={() => (activeTab = 'expenses')}
				role="button"
				tabindex="0"
			>
				<div class="action-icon">🧾</div>
				<div class="action-label">Log Expense</div>
				<div class="action-desc">
					Record feed, fuel, vet costs, labor, equipment, or other expenses.
				</div>
				<div class="action-arrow">→</div>
			</div>

			<div class="action-card" onclick={() => (activeTab = 'herd')} role="button" tabindex="0">
				<div class="action-icon">🐄</div>
				<div class="action-label">Update Herd</div>
				<div class="action-desc">
					Update head count, weights, and market prices to refresh your valuation.
				</div>
				<div class="action-arrow">→</div>
			</div>

			<div
				class="action-card"
				onclick={() => (activeTab = 'projections')}
				role="button"
				tabindex="0"
			>
				<div class="action-icon">📈</div>
				<div class="action-label">View Projections</div>
				<div class="action-desc">
					See 6-month profitability forecasts and profit maximization recommendations.
				</div>
				<div class="action-arrow">→</div>
			</div>
		</div>

		<div class="notice">
			Overview values now reflect saved database entries for income, expenses, and herd groups.
		</div>
	{:else if activeTab === 'income'}
		<div class="form-page">
			<form method="POST" action="?/saveIncome" class="form-card">
				<div class="form-card-header">
					<div class="section-label">Log Income</div>
					<div class="running-total green">Running total: {fmt(totalIncome)}</div>
				</div>

				<div class="form-group">
					<label class="form-label" for="inc-cat">Category</label>
					<select class="form-input" id="inc-cat" name="category" bind:value={incomeCategory}>
						<option value="" disabled>Select a category…</option>
						{#each incomeCategories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label class="form-label" for="inc-desc">Description</label>
					<input
						class="form-input"
						id="inc-desc"
						name="description"
						type="text"
						placeholder="e.g. 12 head feeder steers sold at auction"
						bind:value={incomeDesc}
					/>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label class="form-label" for="inc-amt">Amount ($)</label>
						<input
							class="form-input"
							id="inc-amt"
							name="amount"
							type="number"
							placeholder="0.00"
							min="0"
							step="0.01"
							bind:value={incomeAmount}
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="inc-date">Date</label>
						<input
							class="form-input"
							id="inc-date"
							name="date"
							type="date"
							bind:value={incomeDate}
						/>
					</div>
				</div>

				<button class="btn-primary wide" type="submit">Save Income Entry</button>
			</form>

			{#if incomeEntries.length > 0}
				<div class="summary-card">
					<div class="section-label">Saved Entries</div>
					<div class="summary-list">
						{#each [...incomeEntries].reverse() as e}
							<div class="summary-row">
								<div class="summary-left">
									<span class="summary-cat">{e.category}</span>
									<span class="summary-desc">{e.description}</span>
								</div>
								<div class="summary-right">
									<span class="summary-date mono">{e.date}</span>
									<span class="summary-amt green mono">+{fmt(e.amount)}</span>
								</div>
							</div>
						{/each}
					</div>
					<div class="summary-total">
						<span>Total</span>
						<span class="green mono">{fmt(totalIncome)}</span>
					</div>
				</div>
			{/if}
		</div>
	{:else if activeTab === 'expenses'}
		<div class="form-page">
			<form method="POST" action="?/saveExpense" class="form-card">
				<div class="form-card-header">
					<div class="section-label">Log Expense</div>
					<div class="running-total red">Running total: {fmt(totalExpenses)}</div>
				</div>

				<div class="form-group">
					<label class="form-label" for="exp-cat">Category</label>
					<select class="form-input" id="exp-cat" name="category" bind:value={expenseCategory}>
						<option value="" disabled>Select a category…</option>
						{#each expenseCategories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label class="form-label" for="exp-desc">Description</label>
					<input
						class="form-input"
						id="exp-desc"
						name="description"
						type="text"
						placeholder="e.g. Diesel — October fill-up at co-op"
						bind:value={expenseDesc}
					/>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label class="form-label" for="exp-amt">Amount ($)</label>
						<input
							class="form-input"
							id="exp-amt"
							name="amount"
							type="number"
							placeholder="0.00"
							min="0"
							step="0.01"
							bind:value={expenseAmount}
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="exp-date">Date</label>
						<input
							class="form-input"
							id="exp-date"
							name="date"
							type="date"
							bind:value={expenseDate}
						/>
					</div>
				</div>

				<button class="btn-secondary-submit wide" type="submit">Save Expense Entry</button>
			</form>

			{#if expenseEntries.length > 0}
				<div class="summary-card">
					<div class="section-label">Saved Entries</div>
					<div class="summary-list">
						{#each [...expenseEntries].reverse() as e}
							<div class="summary-row">
								<div class="summary-left">
									<span class="summary-cat">{e.category}</span>
									<span class="summary-desc">{e.description}</span>
								</div>
								<div class="summary-right">
									<span class="summary-date mono">{e.date}</span>
									<span class="summary-amt red mono">−{fmt(e.amount)}</span>
								</div>
							</div>
						{/each}
					</div>
					<div class="summary-total">
						<span>Total</span>
						<span class="red mono">{fmt(totalExpenses)}</span>
					</div>
				</div>
			{/if}
		</div>
	{:else if activeTab === 'herd'}
		<div class="kpi-grid">
			<div class="kpi-card">
				<div class="kpi-label">Total Herd Value</div>
				<div class="kpi-value amber">{fmt(herdValue)}</div>
				<div class="kpi-sub">Live market estimate</div>
			</div>

			<div class="kpi-card">
				<div class="kpi-label">Total Head</div>
				<div class="kpi-value">{totalHead}</div>
				<div class="kpi-sub">Across {herdGroups.length} groups</div>
			</div>

			<div class="kpi-card">
				<div class="kpi-label">Avg Value / Head</div>
				<div class="kpi-value">{fmt(avgPerHead)}</div>
				<div class="kpi-sub">Weighted by weight class</div>
			</div>
		</div>

		<div class="card">
			<div class="section-label">Herd Groups</div>
			<div class="herd-note">
				Valuation formula: Head × Avg Weight (lbs) × Price/CWT ÷ 100.
			</div>

			<div class="herd-list">
				{#each herdGroups as g}
					{@const val = (g.count * g.avgWeightLbs * g.pricePerCwt) / 100}

					<div class="herd-row-wrap">
						<form method="POST" action="?/updateHerdGroup" class="herd-row">
							<input type="hidden" name="id" value={g.id} />

							<div class="herd-fields" style="width: 100%">
								<div class="form-group breed-group">
									<div class="herd-field-label">Breed / Class</div>
									<input class="inline-input breed-input" name="breed" type="text" value={g.breed} />
								</div>

								<div class="form-group">
									<div class="herd-field-label">Head</div>
									<input class="inline-input" name="count" type="number" min="0" value={g.count} />
								</div>

								<div class="form-group">
									<div class="herd-field-label">Avg Wt (lbs)</div>
									<input
										class="inline-input"
										name="avgWeightLbs"
										type="number"
										min="0"
										step="0.01"
										value={g.avgWeightLbs}
									/>
								</div>

								<div class="form-group">
									<div class="herd-field-label">$/CWT</div>
									<input
										class="inline-input"
										name="pricePerCwt"
										type="number"
										min="0"
										step="0.01"
										value={g.pricePerCwt}
									/>
								</div>

								<div class="form-group">
									<div class="herd-field-label">Group Value</div>
									<div class="herd-val amber mono">{fmt(val)}</div>
								</div>
							</div>

							<div class="herd-actions">
								<button class="btn-secondary-submit" type="submit">Save</button>
							</div>
						</form>

						<form method="POST" action="?/deleteHerdGroup" class="delete-form">
							<input type="hidden" name="id" value={g.id} />
							<button class="del-btn" type="submit">✕</button>
						</form>
					</div>
				{/each}
			</div>

			<form method="POST" action="?/addHerdGroup" class="herd-add">
				<div class="section-label" style="margin-bottom:14px">Add Herd Group</div>
				<div class="herd-add-fields">
					<div class="form-group">
						<label class="form-label" for="nb">Breed / Class</label>
						<input
							class="form-input"
							id="nb"
							name="breed"
							type="text"
							placeholder="e.g. Hereford Steers"
							bind:value={newBreed}
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="nc">Head Count</label>
						<input
							class="form-input"
							id="nc"
							name="count"
							type="number"
							placeholder="0"
							min="0"
							bind:value={newCount}
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="nw">Avg Weight (lbs)</label>
						<input
							class="form-input"
							id="nw"
							name="avgWeightLbs"
							type="number"
							placeholder="800"
							min="0"
							step="0.01"
							bind:value={newWeight}
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="np">Price / CWT ($)</label>
						<input
							class="form-input"
							id="np"
							name="pricePerCwt"
							type="number"
							placeholder="180"
							min="0"
							step="0.01"
							bind:value={newPrice}
						/>
					</div>
				</div>

				<button class="btn-primary" type="submit">Add Group</button>
			</form>
		</div>
	{:else if activeTab === 'projections'}
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
							<td class="mono" class:green={profit >= 0} class:red={profit < 0}>
								{fmt(profit)}
							</td>
							<td class="mono muted">{mgn}%</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="proj-disclaimer">
				Placeholder forecast data — backend forecasting can be connected later to use saved ranch
				financial data.
			</div>
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
	{/if}
</div>

<style>
	:root {
		--soil: #0f0a04;
		--earth: #1c1208;
		--bark: #2e1e0a;
		--rust: #c4541a;
		--amber: #d4922a;
		--wheat: #e8c87a;
		--cream: #f0e8d5;
		--muted: #8a7a62;
		--sage: #6b8f5e;
		--green: #5a9e5a;
		--red: #c44040;
	}

	.page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 900px;
	}

	.page-header {
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(212, 146, 42, 0.12);
	}

	.eyebrow {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
		margin-bottom: 6px;
	}

	.page-title {
		font-family: 'Lora', serif;
		font-size: clamp(22px, 3vw, 32px);
		font-weight: 700;
		color: var(--cream);
		line-height: 1.1;
	}

	.tabs {
		display: flex;
		gap: 2px;
		border-bottom: 1px solid rgba(212, 146, 42, 0.12);
		flex-wrap: wrap;
	}

	.tab {
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 10px 18px;
		margin-bottom: -1px;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		color: var(--muted);
		cursor: pointer;
		transition:
			color 0.18s,
			border-color 0.18s;
	}

	.tab:hover {
		color: var(--cream);
	}

	.tab.active {
		color: var(--wheat);
		border-bottom-color: var(--amber);
	}

	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
	}

	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 14px;
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

	.notice {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		color: var(--muted);
		background: rgba(212, 146, 42, 0.05);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 6px;
		padding: 14px 18px;
		line-height: 1.65;
	}

	.form-page {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.15);
		border-radius: 8px;
		padding: 28px 28px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 10px;
	}

	.running-total {
		font-family: 'Lora', serif;
		font-size: 20px;
		font-weight: 700;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.form-input {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(212, 146, 42, 0.18);
		color: var(--cream);
		padding: 11px 14px;
		border-radius: 5px;
		font-size: 14px;
		font-family: 'DM Sans', sans-serif;
		transition: border-color 0.18s;
		width: 100%;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--amber);
	}

	.form-input option {
		background: var(--bark);
	}

	.btn-primary {
		background: var(--rust);
		color: var(--cream);
		border: none;
		border-radius: 5px;
		padding: 11px 22px;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 0.18s,
			transform 0.15s;
		width: fit-content;
	}

	.btn-primary:hover {
		background: #d4621f;
		transform: translateY(-1px);
	}

	.btn-primary.wide {
		width: 100%;
	}

	.btn-secondary-submit {
		background: transparent;
		color: var(--cream);
		border: 1px solid rgba(212, 146, 42, 0.35);
		border-radius: 5px;
		padding: 11px 22px;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.18s,
			background 0.18s;
		width: fit-content;
	}

	.btn-secondary-submit:hover {
		border-color: var(--amber);
		background: rgba(212, 146, 42, 0.06);
	}

	.btn-secondary-submit.wide {
		width: 100%;
	}

	.summary-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.summary-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}

	.summary-row:last-child {
		border-bottom: none;
	}

	.summary-left {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.summary-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 3px;
		flex-shrink: 0;
	}

	.summary-cat {
		font-size: 12px;
		color: var(--wheat);
		font-weight: 500;
	}

	.summary-desc {
		font-size: 12px;
		color: var(--muted);
	}

	.summary-date {
		font-size: 11px;
		color: var(--muted);
	}

	.summary-amt {
		font-size: 14px;
		font-weight: 600;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 12px;
		border-top: 1px solid rgba(212, 146, 42, 0.15);
		font-size: 14px;
		font-weight: 600;
		color: var(--cream);
	}

	.card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.herd-note {
		font-size: 12px;
		color: var(--muted);
		line-height: 1.65;
		background: rgba(212, 146, 42, 0.05);
		border: 1px solid rgba(212, 146, 42, 0.1);
		border-radius: 5px;
		padding: 12px 16px;
	}

	.herd-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.herd-row-wrap {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.herd-row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(212, 146, 42, 0.08);
		border-radius: 6px;
		flex-wrap: wrap;
		flex: 1;
	}

	.herd-fields {
		display: flex;
		gap: 14px;
		flex: 1;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.herd-field-label {
		font-family: 'DM Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.herd-val {
		font-family: 'DM Mono', monospace;
		font-size: 14px;
		font-weight: 600;
		padding: 6px 0;
	}

	.inline-input {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(212, 146, 42, 0.15);
		color: var(--cream);
		padding: 7px 10px;
		border-radius: 4px;
		font-size: 13px;
		font-family: 'DM Mono', monospace;
		width: 88px;
		transition: border-color 0.18s;
	}

	.inline-input:focus {
		outline: none;
		border-color: var(--amber);
	}

	.breed-group {
		min-width: 180px;
	}

	.breed-input {
		width: 180px;
	}

	.herd-actions {
		display: flex;
		align-items: flex-end;
	}

	.delete-form {
		display: flex;
		align-items: center;
	}

	.herd-add {
		border-top: 1px solid rgba(212, 146, 42, 0.12);
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.herd-add-fields {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 14px;
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

	.proj-disclaimer {
		font-size: 11px;
		color: var(--muted);
		background: rgba(212, 146, 42, 0.04);
		border: 1px solid rgba(212, 146, 42, 0.1);
		border-radius: 5px;
		padding: 10px 14px;
		line-height: 1.6;
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

	.amber {
		color: var(--amber) !important;
	}

	.dim {
		color: var(--muted) !important;
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

	.del-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(196, 64, 64, 0.35);
		font-size: 13px;
		padding: 4px 8px;
		border-radius: 4px;
		flex-shrink: 0;
		transition:
			color 0.18s,
			background 0.18s;
	}

	.del-btn:hover {
		color: var(--red);
		background: rgba(196, 64, 64, 0.1);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.herd-add-fields {
			grid-template-columns: 1fr 1fr;
		}

		.kpi-grid {
			grid-template-columns: 1fr 1fr;
		}

		.action-grid {
			grid-template-columns: 1fr 1fr;
		}

		.herd-row-wrap {
			flex-direction: column;
		}

		.delete-form {
			align-self: flex-end;
		}
	}
</style>