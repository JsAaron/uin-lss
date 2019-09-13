<template>
	<view></view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	components: {},
	data() {
		return {};
	},
	props: {},
	created() {},
	onLoad(options) {
		console.log(options)
		options.data = `{"order_id":"2019091317562380172","amount":"399","consignee":"陈文","telephone":"13411111111","address":"是打发送达方式123是打发是"}`
	},
	methods: {}
};
</script>

<style lang="scss"></style>
