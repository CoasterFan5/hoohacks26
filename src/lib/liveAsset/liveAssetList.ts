export const liveAssetList = ['cattle', 'chicken', 'carrot'] as const;

export type LiveAssetType = (typeof liveAssetList)[number];
