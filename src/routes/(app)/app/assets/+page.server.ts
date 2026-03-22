import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type AssetCategory =
	| 'Vehicles'
	| 'Machinery'
	| 'Buildings'
	| 'Infrastructure'
	| 'Equipment'
	| 'Tools';

type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor';

type RanchAsset = {
	id: number;
	name: string;
	category: AssetCategory;
	quantity: number;
	purchasePrice: number;
	currentUnitValue: number;
	purchaseYear: number;
	condition: AssetCondition;
	lastUpdated: string;
};

const assetCategories: AssetCategory[] = [
	'Vehicles',
	'Machinery',
	'Buildings',
	'Infrastructure',
	'Equipment',
	'Tools'
];

const assetConditions: AssetCondition[] = ['Excellent', 'Good', 'Fair', 'Poor'];

// Demo-only in-memory storage.
// This resets when the server restarts.
let assets: RanchAsset[] = [
	{
		id: 1,
		name: 'Ford F-250 Ranch Truck',
		category: 'Vehicles',
		quantity: 2,
		purchasePrice: 42000,
		currentUnitValue: 36500,
		purchaseYear: 2021,
		condition: 'Good',
		lastUpdated: '2026-03-22'
	},
	{
		id: 2,
		name: 'John Deere Utility Tractor',
		category: 'Machinery',
		quantity: 1,
		purchasePrice: 78000,
		currentUnitValue: 70500,
		purchaseYear: 2022,
		condition: 'Excellent',
		lastUpdated: '2026-03-22'
	},
	{
		id: 3,
		name: 'Gooseneck Trailer',
		category: 'Equipment',
		quantity: 1,
		purchasePrice: 18500,
		currentUnitValue: 16000,
		purchaseYear: 2020,
		condition: 'Good',
		lastUpdated: '2026-03-22'
	},
	{
		id: 4,
		name: 'Perimeter Fencing System',
		category: 'Infrastructure',
		quantity: 1,
		purchasePrice: 54000,
		currentUnitValue: 49000,
		purchaseYear: 2023,
		condition: 'Good',
		lastUpdated: '2026-03-22'
	},
	{
		id: 5,
		name: 'Main Equipment Barn',
		category: 'Buildings',
		quantity: 1,
		purchasePrice: 125000,
		currentUnitValue: 131000,
		purchaseYear: 2019,
		condition: 'Excellent',
		lastUpdated: '2026-03-22'
	}
];

function enrichAsset(asset: RanchAsset) {
	const totalPurchaseValue = asset.purchasePrice * asset.quantity;
	const totalCurrentValue = asset.currentUnitValue * asset.quantity;
	const changeInValue = totalCurrentValue - totalPurchaseValue;
	const percentChange =
		totalPurchaseValue === 0 ? 0 : (changeInValue / totalPurchaseValue) * 100;

	return {
		...asset,
		totalPurchaseValue,
		totalCurrentValue,
		changeInValue,
		percentChange
	};
}

function buildPageData() {
	const enrichedAssets = assets.map(enrichAsset);

	const totalPurchaseValue = enrichedAssets.reduce(
		(sum, asset) => sum + asset.totalPurchaseValue,
		0
	);

	const totalCurrentValue = enrichedAssets.reduce(
		(sum, asset) => sum + asset.totalCurrentValue,
		0
	);

	const netChange = totalCurrentValue - totalPurchaseValue;

	const categoryBreakdown = Object.entries(
		enrichedAssets.reduce<Record<string, number>>((acc, asset) => {
			acc[asset.category] = (acc[asset.category] ?? 0) + asset.totalCurrentValue;
			return acc;
		}, {})
	).map(([category, totalValue]) => ({
		category,
		totalValue
	}));

	return {
		pageTitle: 'Physical Asset Value Tracker',
		pageDescription:
			'Track the price and estimated value of ranch physical assets excluding crops and livestock.',
		assets: enrichedAssets,
		summary: {
			totalAssets: enrichedAssets.length,
			totalPurchaseValue,
			totalCurrentValue,
			netChange
		},
		categoryBreakdown,
		assetCategories,
		assetConditions
	};
}

export const load: PageServerLoad = async () => {
	return buildPageData();
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const name = String(formData.get('name') ?? '').trim();
		const category = String(formData.get('category') ?? '').trim() as AssetCategory;
		const quantity = Number(formData.get('quantity'));
		const purchasePrice = Number(formData.get('purchasePrice'));
		const currentUnitValue = Number(formData.get('currentUnitValue'));
		const purchaseYear = Number(formData.get('purchaseYear'));
		const condition = String(formData.get('condition') ?? '').trim() as AssetCondition;

		const errors: Record<string, string> = {};

		if (name.length < 2) errors.name = 'Asset name must be at least 2 characters.';
		if (!assetCategories.includes(category)) errors.category = 'Select a valid category.';
		if (!Number.isFinite(quantity) || quantity < 1)
			errors.quantity = 'Quantity must be at least 1.';
		if (!Number.isFinite(purchasePrice) || purchasePrice < 0)
			errors.purchasePrice = 'Purchase price must be 0 or greater.';
		if (!Number.isFinite(currentUnitValue) || currentUnitValue < 0)
			errors.currentUnitValue = 'Current unit value must be 0 or greater.';
		if (!Number.isFinite(purchaseYear) || purchaseYear < 1900 || purchaseYear > 2100)
			errors.purchaseYear = 'Enter a valid purchase year.';
		if (!assetConditions.includes(condition)) errors.condition = 'Select a valid condition.';

		if (Object.keys(errors).length > 0) {
			return fail(400, {
				success: false,
				errors,
				values: {
					name,
					category,
					quantity,
					purchasePrice,
					currentUnitValue,
					purchaseYear,
					condition
				}
			});
		}

		const newAsset: RanchAsset = {
			id: Date.now(),
			name,
			category,
			quantity,
			purchasePrice,
			currentUnitValue,
			purchaseYear,
			condition,
			lastUpdated: new Date().toISOString().slice(0, 10)
		};

		assets = [newAsset, ...assets];

		return {
			success: true,
			message: 'Asset added successfully.'
		};
	}
};