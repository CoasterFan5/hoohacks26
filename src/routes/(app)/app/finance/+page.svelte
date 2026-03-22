<script lang="ts">
	// ── TYPES ──────────────────────────────────────────────
	type EntryType = 'income' | 'expense';

	interface Entry {
		id: number;
		type: EntryType;
		category: string;
		description: string;
		amount: number;
		date: string;
	}

	interface HerdGroup {
		breed: string;
		count: number;
		avgWeightLbs: number;
		pricePerCwt: number;
	}

	// ── INCOME FORM STATE ──────────────────────────────────
	let incomeCategory = $state('');
	let incomeDesc = $state('');
	let incomeAmount = $state('');
	let incomeDate = $state(today());
	let incomeSubmitted = $state(false);
	let incomeEntries = $state<Entry[]>([]);

	// ── EXPENSE FORM STATE ─────────────────────────────────
	let expenseCategory = $state('');
	let expenseDesc = $state('');
	let expenseAmount = $state('');
	let expenseDate = $state(today());
	let expenseSubmitted = $state(false);
	let expenseEntries = $state<Entry[]>([]);

	// ── HERD STATE ─────────────────────────────────────────
	let herdGroups = $state<HerdGroup[]>([
		{ breed: 'Angus Steers', count: 42, avgWeightLbs: 850, pricePerCwt: 182 },
		{ breed: 'Angus Heifers', count: 28, avgWeightLbs: 780, pricePerCwt: 175 },
		{ breed: 'Brahman Cross', count: 15, avgWeightLbs: 920, pricePerCwt: 168 },
		{ breed: 'Breeding Cows', count: 35, avgWeightLbs: 1200, pricePerCwt: 140 }
	]);

	let newBreed = $state('');
	let newCount = $state('');
	let newWeight = $state('');
	let newPrice = $state('');

	// ── DERIVED ────────────────────────────────────────────
	let totalIncome = $derived(incomeEntries.reduce((s, e) => s + e.amount, 0));
	let totalExpenses = $derived(expenseEntries.reduce((s, e) => s + e.amount, 0));
	let netProfit = $derived(totalIncome - totalExpenses);
	let margin = $derived(totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '—');

	let herdValue = $derived(
		herdGroups.reduce((s, g) => s + (g.count * g.avgWeightLbs * g.pricePerCwt) / 100, 0)
	);
	let totalHead = $derived(herdGroups.reduce((s, g) => s + g.count, 0));
	let avgPerHead = $derived(totalHead > 0 ? Math.round(herdValue / totalHead) : 0);

	// Projection placeholders (6 months forward)
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

	// ── HELPERS ────────────────────────────────────────────
	function today() {
		return new Date().toISOString().slice(0, 10);
	}

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}

	// ── ACTIONS ────────────────────────────────────────────
	function submitIncome() {
		const amt = parseFloat(incomeAmount);
		if (!incomeCategory || !incomeDesc || isNaN(amt) || amt <= 0) return;
		incomeEntries = [
			...incomeEntries,
			{
				id: Date.now(),
				type: 'income',
				category: incomeCategory,
				description: incomeDesc,
				amount: amt,
				date: incomeDate
			}
		];
		incomeSubmitted = true;
		incomeCategory = '';
		incomeDesc = '';
		incomeAmount = '';
		incomeDate = today();
		setTimeout(() => (incomeSubmitted = false), 3000);
	}

	function submitExpense() {
		const amt = parseFloat(expenseAmount);
		if (!expenseCategory || !expenseDesc || isNaN(amt) || amt <= 0) return;
		expenseEntries = [
			...expenseEntries,
			{
				id: Date.now(),
				type: 'expense',
				category: expenseCategory,
				description: expenseDesc,
				amount: amt,
				date: expenseDate
			}
		];
		expenseSubmitted = true;
		expenseCategory = '';
		expenseDesc = '';
		expenseAmount = '';
		expenseDate = today();
		setTimeout(() => (expenseSubmitted = false), 3000);
	}

	function addHerdGroup() {
		const count = parseInt(newCount);
		const weight = parseFloat(newWeight);
		const price = parseFloat(newPrice);
		if (!newBreed || isNaN(count) || isNaN(weight) || isNaN(price)) return;
		herdGroups = [
			...herdGroups,
			{ breed: newBreed, count, avgWeightLbs: weight, pricePerCwt: price }
		];
		newBreed = '';
		newCount = '';
		newWeight = '';
		newPrice = '';
	}

	function removeHerdGroup(i: number) {
		herdGroups = herdGroups.filter((_, idx) => idx !== i);
	}

	let activeTab = 'overview';
</script>

<svelte:head>
	<title>Core Finance — Moonance</title>
</svelte:head>

<!-- ════════════════════════════════════ -->
<!--  OVERVIEW                           -->
<!-- ════════════════════════════════════ -->
{#if activeTab === 'overview'}
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
		<div class="kpi-card">
			<div class="kpi-label">Herd Valuation</div>
			<div class="kpi-value amber">{fmt(herdValue)}</div>
			<div class="kpi-sub">{totalHead} head · {fmt(avgPerHead)}/head</div>
		</div>
	</div>

	<!-- Quick-action cards -->
	<div class="action-grid">
		<div class="action-card" onclick={() => (activeTab = 'income')} role="button" tabindex="0">
			<div class="action-icon">💰</div>
			<div class="action-label">Log Income</div>
			<div class="action-desc">
				Record a livestock sale, crop sale, government payment, or other income.
			</div>
			<div class="action-arrow">→</div>
		</div>
		<div class="action-card" onclick={() => (activeTab = 'expenses')} role="button" tabindex="0">
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
		<div class="action-card" onclick={() => (activeTab = 'projections')} role="button" tabindex="0">
			<div class="action-icon">📈</div>
			<div class="action-label">View Projections</div>
			<div class="action-desc">
				See 6-month profitability forecasts and profit maximization recommendations.
			</div>
			<div class="action-arrow">→</div>
		</div>
	</div>

	<!-- Placeholder notice -->

	<!-- ════════════════════════════════════ -->
	<!--  INCOME                             -->
	<!-- ════════════════════════════════════ -->
{:else if activeTab === 'income'}
	<div class="form-page">
		<div class="form-card">
			<div class="form-card-header">
				<div class="section-label">Log Income</div>
				<div class="running-total green">Running total: {fmt(totalIncome)}</div>
			</div>

			{#if incomeSubmitted}
				<div class="success-banner">✅ Income entry saved successfully.</div>
			{/if}

			<div class="form-group">
				<label class="form-label" for="inc-cat">Category</label>
				<select class="form-input" id="inc-cat" bind:value={incomeCategory}>
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
						type="number"
						placeholder="0.00"
						min="0"
						step="0.01"
						bind:value={incomeAmount}
					/>
				</div>
				<div class="form-group">
					<label class="form-label" for="inc-date">Date</label>
					<input class="form-input" id="inc-date" type="date" bind:value={incomeDate} />
				</div>
			</div>

			<button class="btn-primary wide" onclick={submitIncome}> Save Income Entry </button>
		</div>

		<!-- Recent entries summary -->
		{#if incomeEntries.length > 0}
			<div class="summary-card">
				<div class="section-label">Entries This Session</div>
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

	<!-- ════════════════════════════════════ -->
	<!--  EXPENSES                           -->
	<!-- ════════════════════════════════════ -->
{:else if activeTab === 'expenses'}
	<div class="form-page">
		<div class="form-card">
			<div class="form-card-header">
				<div class="section-label">Log Expense</div>
				<div class="running-total red">Running total: {fmt(totalExpenses)}</div>
			</div>

			{#if expenseSubmitted}
				<div class="success-banner">✅ Expense entry saved successfully.</div>
			{/if}

			<div class="form-group">
				<label class="form-label" for="exp-cat">Category</label>
				<select class="form-input" id="exp-cat" bind:value={expenseCategory}>
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
						type="number"
						placeholder="0.00"
						min="0"
						step="0.01"
						bind:value={expenseAmount}
					/>
				</div>
				<div class="form-group">
					<label class="form-label" for="exp-date">Date</label>
					<input class="form-input" id="exp-date" type="date" bind:value={expenseDate} />
				</div>
			</div>

			<button class="btn-secondary-submit wide" onclick={submitExpense}>
				Save Expense Entry
			</button>
		</div>

		{#if expenseEntries.length > 0}
			<div class="summary-card">
				<div class="section-label">Entries This Session</div>
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

	<!-- ════════════════════════════════════ -->
	<!--  HERD VALUATION                     -->
	<!-- ════════════════════════════════════ -->
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
			Valuation formula: Head × Avg Weight (lbs) × Price/CWT ÷ 100. Edit any field and the total
			updates instantly.
		</div>

		<div class="herd-list">
			{#each herdGroups as g, i}
				{@const val = (g.count * g.avgWeightLbs * g.pricePerCwt) / 100}
				<div class="herd-row">
					<div class="herd-breed">{g.breed}</div>
					<div class="herd-fields">
						<div class="herd-field">
							<div class="herd-field-label">Head</div>
							<input class="inline-input" type="number" bind:value={herdGroups[i].count} min="0" />
						</div>
						<div class="herd-field">
							<div class="herd-field-label">Avg Wt (lbs)</div>
							<input
								class="inline-input"
								type="number"
								bind:value={herdGroups[i].avgWeightLbs}
								min="0"
							/>
						</div>
						<div class="herd-field">
							<div class="herd-field-label">$/CWT</div>
							<input
								class="inline-input"
								type="number"
								bind:value={herdGroups[i].pricePerCwt}
								min="0"
							/>
						</div>
						<div class="herd-field">
							<div class="herd-field-label">Group Value</div>
							<div class="herd-val amber mono">{fmt(val)}</div>
						</div>
					</div>
					<button class="del-btn" onclick={() => removeHerdGroup(i)}>✕</button>
				</div>
			{/each}
		</div>

		<!-- Add group form -->
		<div class="herd-add">
			<div class="section-label" style="margin-bottom:14px">Add Herd Group</div>
			<div class="herd-add-fields">
				<div class="form-group">
					<label class="form-label" for="nb">Breed / Class</label>
					<input
						class="form-input"
						id="nb"
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
						type="number"
						placeholder="800"
						min="0"
						bind:value={newWeight}
					/>
				</div>
				<div class="form-group">
					<label class="form-label" for="np">Price / CWT ($)</label>
					<input
						class="form-input"
						id="np"
						type="number"
						placeholder="180"
						min="0"
						bind:value={newPrice}
					/>
				</div>
			</div>
			<button class="btn-primary" onclick={addHerdGroup}>Add Group</button>
		</div>
	</div>

	<!-- ════════════════════════════════════ -->
	<!--  PROJECTIONS                        -->
	<!-- ════════════════════════════════════ -->
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
{/if}

<style>
	/* ── TABS ── */

	/* ── SECTION LABEL ── */
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
	}

	/* ── KPI GRID ── */
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

	/* ── ACTION CARDS (overview) ── */
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

	/* ── NOTICE ── */
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

	/* ── FORM PAGE LAYOUT ── */
	.form-page {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* ── FORM CARD ── */
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

	/* ── SUCCESS BANNER ── */
	.success-banner {
		background: rgba(90, 158, 90, 0.1);
		border: 1px solid rgba(90, 158, 90, 0.3);
		color: var(--sage);
		border-radius: 6px;
		padding: 12px 16px;
		font-size: 13px;
		font-family: 'DM Mono', monospace;
	}

	/* ── FORM ELEMENTS ── */
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

	/* ── BUTTONS ── */
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

	/* ── SUMMARY CARD ── */
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

	/* ── CARD ── */
	.card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.12);
		border-radius: 8px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	/* ── HERD ── */
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
	.herd-row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(212, 146, 42, 0.08);
		border-radius: 6px;
		flex-wrap: wrap;
	}
	.herd-breed {
		font-family: 'Lora', serif;
		font-size: 14px;
		font-weight: 600;
		color: var(--wheat);
		min-width: 130px;
		flex-shrink: 0;
	}
	.herd-fields {
		display: flex;
		gap: 14px;
		flex: 1;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.herd-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
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

	/* ── PROJECTIONS ── */
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

	/* ── LEDGER ── */
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

	/* ── RECOMMENDATIONS ── */
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

	/* ── UTILS ── */
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

	/* ── RESPONSIVE ── */
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
	}
</style>
