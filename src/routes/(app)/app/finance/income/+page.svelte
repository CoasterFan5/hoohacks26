<script lang="ts">
	import { getIncomeData, saveIncome } from './income.remote';

	let incomeEntries = $state(await getIncomeData());

	let incomeCategory = $state('');
	let incomeDesc = $state('');
	let incomeAmount = $state('');
	
	function today() {
		return new Date().toISOString().slice(0, 10);
	}
	let incomeDate = $state(today());
	let incomeSubmitted = $state(false);

	const incomeCategories = [
		'Livestock Sale',
		'Crop Sale',
		'Government Payment',
		'Custom Work',
		'Insurance Payout',
		'Other'
	];

	function fmt(n: number) {
		return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}

	let totalIncome = $derived(incomeEntries.reduce((s, e) => s + e.amount, 0));

	async function submitIncome(e: Event) {
		e.preventDefault();
		const amt = parseFloat(incomeAmount);
		if (!incomeCategory || !incomeDesc || isNaN(amt) || amt <= 0) return;
		
		await saveIncome({
			category: incomeCategory,
			description: incomeDesc,
			amount: amt,
			date: incomeDate
		});

		incomeEntries = await getIncomeData();

		incomeSubmitted = true;
		incomeCategory = '';
		incomeDesc = '';
		incomeAmount = '';
		incomeDate = today();
		setTimeout(() => (incomeSubmitted = false), 3000);
	}
</script>

<svelte:head>
	<title>Income — Moonance</title>
</svelte:head>

<div class="form-page">
	<form class="form-card" onsubmit={submitIncome}>
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

		<button class="btn-primary wide" type="submit"> Save Income Entry </button>
	</form>

	{#if incomeEntries.length > 0}
		<div class="summary-card">
			<div class="section-label">Recent Entries</div>
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

<style>
	.section-label {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
	}
	.form-page { display: flex; flex-direction: column; gap: 20px; }
	.form-card {
		background: var(--bark);
		border: 1px solid rgba(212, 146, 42, 0.15);
		border-radius: 8px;
		padding: 28px 28px;
		display: flex; flex-direction: column; gap: 20px;
	}
	.form-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
	.running-total { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; }
	.green { color: var(--green); }
	.success-banner {
		background: rgba(90, 158, 90, 0.1);
		border: 1px solid rgba(90, 158, 90, 0.3);
		color: var(--sage);
		border-radius: 6px; padding: 12px 16px; font-size: 13px; font-family: 'DM Mono', monospace;
	}
	.form-group { display: flex; flex-direction: column; gap: 7px; }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
	.form-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
	.form-input {
		background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(212, 146, 42, 0.18);
		color: var(--cream); padding: 11px 14px; border-radius: 5px; font-size: 14px; width: 100%; box-sizing: border-box;
	}
	.form-input:focus { outline: none; border-color: var(--amber); }
	.btn-primary {
		background: var(--rust); color: var(--cream); border: none; border-radius: 5px; padding: 11px 22px; cursor: pointer; font-weight: 500;
	}
	.btn-primary:hover { background: #d4621f; }
	.wide { width: 100%; }
	.summary-card { background: var(--bark); border: 1px solid rgba(212, 146, 42, 0.12); border-radius: 8px; padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; }
	.summary-list { display: flex; flex-direction: column; gap: 1px; }
	.summary-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
	.summary-left { display: flex; flex-direction: column; gap: 3px; }
	.summary-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
	.summary-cat { font-size: 12px; color: var(--wheat); font-weight: 500; }
	.summary-desc { font-size: 12px; color: var(--muted); }
	.summary-date { font-size: 11px; color: var(--muted); }
	.summary-amt { font-size: 14px; font-weight: 600; }
	.summary-total { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(212, 146, 42, 0.15); font-size: 14px; font-weight: 600; color: var(--cream); }
	.mono { font-family: 'DM Mono', monospace; }
</style>
