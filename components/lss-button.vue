<template>
	<view class="button">
		<waves-button
			@click="this.$emit('click')"
			btnStyle="background:linear-gradient(to right,#65a1fb, #4f96ff);border-radius:5px"
			wavesColor="rgba(79,150,255)"
		>
			<slot></slot>
		</waves-button>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import wavesButton from '@/components/waves-button/waves-button';
export default {
	components: {
		wavesButton
	},
	data() {
		return {};
	},
	props: {},
	created() {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
	// .button{
	// 	margin: 0 auto;
	// }
	
</style>
