<template>
	<view>1</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	onLoad() {
		console.log($$get.avatarUrl())
	}
};
</script>

<style></style>
