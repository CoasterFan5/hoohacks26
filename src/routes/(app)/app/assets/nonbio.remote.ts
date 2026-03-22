<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(value);
	}

	function formatPercent(value: number) {
		return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
	}
</script>

<svelte:head>
	<title>{data.pageTitle}</title>
	<meta name="description" content={data.pageDescription} />
</svelte:head>

<div class="page">
	<section class="hero">
		<p class="eyebrow">Asset Tracking</p>
		<h1>{data.pageTitle}</h1>
		<p class="subtitle">{data.pageDescription}</p>
	</section>

	<section class="panel">
		<div class="panel-header">
			<div>
				<h2>Add a new asset</h2>
				<p>Add trucks, machinery, buildings, tools, trailers, or infrastructure.</p>
			</div>
		</div>

		<form method="POST" use:enhance class="asset-form">
			<div class="form-grid">
				<label>
					<span>Asset name</span>
					<input
						name="name"
						type="text"
						placeholder="John Deere Skid Steer"
						value={form?.values?.name ?? ''}
					/>
					{#if form?.errors?.name}
						<small class="error">{form.errors.name}</small>
					{/if}
				</label>

				<label>
					<span>Category</span>
					<select name="category">
						<option value="">Select category</option>
						{#each data.assetCategories as category}
							<option
								value={category}
								selected={form?.values?.category === category}
							>
								{category}
							</option>
						{/each}
					</select>
					{#if form?.errors?.category}
						<small class="error">{form.errors.category}</small>
					{/if}
				</label>

				<label>
					<span>Quantity</span>
					<input
						name="quantity"
						type="number"
						min="1"
						step="1"
						value={form?.values?.quantity ?? 1}
					/>
					{#if form?.errors?.quantity}
						<small class="error">{form.errors.quantity}</small>
					{/if}
				</label>

				<label>
					<span>Purchase price</span>
					<input
						name="purchasePrice"
						type="number"
						min="0"
						step="100"
						value={form?.values?.purchasePrice ?? ''}
					/>
					{#if form?.errors?.purchasePrice}
						<small class="error">{form.errors.purchasePrice}</small>
					{/if}
				</label>

				<label>
					<span>Current unit value</span>
					<input
						name="currentUnitValue"
						type="number"
						min="0"
						step="100"
						value={form?.values?.currentUnitValue ?? ''}
					/>
					{#if form?.errors?.currentUnitValue}
						<small class="error">{form.errors.currentUnitValue}</small>
					{/if}
				</label>

				<label>
					<span>Purchase year</span>
					<input
						name="purchaseYear"
						type="number"
						min="1900"
						max="2100"
						value={form?.values?.purchaseYear ?? 2024}
					/>
					{#if form?.errors?.purchaseYear}
						<small class="error">{form.errors.purchaseYear}</small>
					{/if}
				</label>

				<label>
					<span>Condition</span>
					<select name="condition">
						<option value="">Select condition</option>
						{#each data.assetConditions as condition}
							<option
								value={condition}
								selected={form?.values?.condition === condition}
							>
								{condition}
							</option>
						{/each}
					</select>
					{#if form?.errors?.condition}
						<small class="error">{form.errors.condition}</small>
					{/if}
				</label>
			</div>

			{#if form?.success && form?.message}
				<p class="success">{form.message}</p>
			{/if}

			<button class="submit-btn" type="submit">Add Asset</button>
		</form>
	</section>

	<section class="summary-grid">
		<div class="summary-card">
			<p class="label">Tracked Assets</p>
			<h2>{data.summary.totalAssets}</h2>
		</div>

		<div class="summary-card">
			<p class="label">Original Purchase Value</p>
			<h2>{formatCurrency(data.summary.totalPurchaseValue)}</h2>
		</div>

		<div class="summary-card">
			<p class="label">Current Estimated Value</p>
			<h2>{formatCurrency(data.summary.totalCurrentValue)}</h2>
		</div>

		<div class="summary-card">
			<p class="label">Net Value Change</p>
			<h2 class:data-positive={data.summary.netChange >= 0} class:data-negative={data.summary.netChange < 0}>
				{formatCurrency(data.summary.netChange)}
			</h2>
		</div>
	</section>

	<section class="panel">
		<div class="panel-header">
			<div>
				<h2>Category Breakdown</h2>
				<p>Estimated current value by physical asset type.</p>
			</div>
		</div>

		<div class="breakdown-grid">
			{#each data.categoryBreakdown as item}
				<div class="breakdown-card">
					<p class="label">{item.category}</p>
					<h3>{formatCurrency(item.totalValue)}</h3>
				</div>
			{/each}
		</div>
	</section>

	<section class="panel">
		<div class="panel-header">
			<div>
				<h2>Asset Register</h2>
				<p>Physical ranch assets excluding crops and livestock.</p>
			</div>
		</div>

		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Asset</th>
						<th>Category</th>
						<th>Qty</th>
						<th>Purchase Price</th>
						<th>Current Unit Value</th>
						<th>Total Current Value</th>
						<th>Change</th>
						<th>% Change</th>
						<th>Condition</th>
					</tr>
				</thead>
				<tbody>
					{#each data.assets as asset}
						<tr>
							<td>
								<div class="asset-name">{asset.name}</div>
								<div class="asset-meta">Purchased {asset.purchaseYear}</div>
							</td>
							<td>{asset.category}</td>
							<td>{asset.quantity}</td>
							<td>{formatCurrency(asset.purchasePrice)}</td>
							<td>{formatCurrency(asset.currentUnitValue)}</td>
							<td>{formatCurrency(asset.totalCurrentValue)}</td>
							<td class:data-positive={asset.changeInValue >= 0} class:data-negative={asset.changeInValue < 0}>
								{formatCurrency(asset.changeInValue)}
							</td>
							<td class:data-positive={asset.percentChange >= 0} class:data-negative={asset.percentChange < 0}>
								{formatPercent(asset.percentChange)}
							</td>
							<td>
								<span class="condition-pill">{asset.condition}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	.page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero,
	.panel {
		padding: 1.5rem;
		border-radius: 20px;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
	}

	.hero {
		background: linear-gradient(135deg, #ffffff 0%, #eef4ff 100%);
	}

	.eyebrow {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #475569;
	}

	h1 {
		margin: 0 0 0.75rem 0;
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1.1;
	}

	.subtitle {
		margin: 0;
		max-width: 720px;
		font-size: 1.05rem;
		line-height: 1.6;
		color: #475569;
	}

	.panel-header {
		margin-bottom: 1rem;
	}

	.panel-header h2 {
		margin: 0 0 0.35rem 0;
		font-size: 1.25rem;
	}

	.panel-header p {
		margin: 0;
		color: #475569;
	}

	.asset-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 600;
	}

	input,
	select {
		padding: 0.75rem 0.9rem;
		border: 1px solid #cbd5e1;
		border-radius: 12px;
		font: inherit;
		background: white;
	}

	.submit-btn {
		align-self: flex-start;
		padding: 0.8rem 1.2rem;
		border: none;
		border-radius: 12px;
		background: #0f172a;
		color: white;
		font-weight: 700;
		cursor: pointer;
	}

	.success {
		margin: 0;
		color: #15803d;
		font-weight: 700;
	}

	.error {
		color: #b91c1c;
		font-weight: 600;
	}

	.summary-grid,
	.breakdown-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.summary-card,
	.breakdown-card {
		padding: 1.25rem;
		border-radius: 16px;
		background: #ffffff;
		border: 1px solid #e2e8f0;
		box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
	}

	.summary-card h2,
	.breakdown-card h3 {
		margin: 0;
		font-size: 1.5rem;
	}

	.label {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #64748b;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 980px;
	}

	th,
	td {
		padding: 0.9rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid #e2e8f0;
		vertical-align: middle;
	}

	th {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #64748b;
		background: #f8fafc;
	}

	.asset-name {
		font-weight: 700;
		color: #0f172a;
	}

	.asset-meta {
		font-size: 0.85rem;
		color: #64748b;
		margin-top: 0.15rem;
	}

	.condition-pill {
		display: inline-block;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		background: #eff6ff;
		color: #1d4ed8;
		font-weight: 600;
		font-size: 0.85rem;
	}

	.data-positive {
		color: #15803d;
		font-weight: 700;
	}

	.data-negative {
		color: #b91c1c;
		font-weight: 700;
	}
</style>