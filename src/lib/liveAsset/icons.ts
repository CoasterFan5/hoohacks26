import type { Component } from 'svelte';
import type { LiveAssetType } from './liveAssetList';
import PhCow from '~icons/ph/cow';
import EggIcon from '~icons/ph/egg';
import PhCarrot from '~icons/ph/carrot';

export const iconMap: Record<LiveAssetType, Component> = {
	cattle: PhCow,
	chicken: EggIcon,
	carrot: PhCarrot
};
