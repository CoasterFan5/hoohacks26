import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		assets: [] as { name: string; type: string; mass: number; value: number; created: string }[]
	};
};
