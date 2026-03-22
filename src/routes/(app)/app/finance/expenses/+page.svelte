<script lang="ts">
	import { getExpensesData, saveExpense } from './expenses.remote';

	let expenseEntries = $state(await getExpensesData());

	let expenseCategory = $state('');
	let expenseDesc = $state('');
	let expenseAmount = $state('');

	function today() {
		return new Date().toISOString().slice(0, 10);
	}
	let expenseDate = $state(today());
	let expenseSubmitted = $state(false);

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

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}

	let totalExpenses = $derived(expenseEntries.reduce((s, e) => s + e.amount, 0));

	async function submitExpense(e: Event) {
		e.preventDefault();
		const amt = parseFloat(expenseAmount);
		if (!expenseCategory || !expenseDesc || isNaN(amt) || amt <= 0) return;

		await saveExpense({
			category: expenseCategory,
			description: expenseDesc,
			amount: amt,
			date: expenseDate
		});

		expenseEntries = await getExpensesData();

		expenseSubmitted = true;
		expenseCategory = '';
		expenseDesc = '';
		expenseAmount = '';
		expenseDate = today();
		setTimeout(() => (expenseSubmitted = false), 3000);
	}
</script>

<svelte:head>
	<title>Expenses — Moonance</title>
</svelte:head>

<div class="form-page">
	<form class="form-card" onsubmit={submitExpense}>
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

		<button class="btn-secondary-submit wide" type="submit"> Save Expense Entry </button>
	</form>

	{#if expenseEntries.length > 0}
		<div class="summary-card">
			<div class="section-label">Recent Entries</div>
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

<style>
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
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
	.red {
		color: var(--red);
	}
	.success-banner {
		background: rgba(90, 158, 90, 0.1);
		border: 1px solid rgba(90, 158, 90, 0.3);
		color: var(--sage);
		border-radius: 6px;
		padding: 12px 16px;
		font-size: 13px;
		font-family: 'DM Mono', monospace;
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
		width: 100%;
		box-sizing: border-box;
	}
	.form-input:focus {
		outline: none;
		border-color: var(--amber);
	}
	.btn-secondary-submit {
		background: transparent;
		color: var(--cream);
		border: 1px solid rgba(212, 146, 42, 0.35);
		border-radius: 5px;
		padding: 11px 22px;
		cursor: pointer;
		font-weight: 500;
	}
	.btn-secondary-submit:hover {
		border-color: var(--amber);
		background: rgba(212, 146, 42, 0.06);
	}
	.wide {
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
	.mono {
		font-family: 'DM Mono', monospace;
	}
</style>
