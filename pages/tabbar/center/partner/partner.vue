<template>
	<view>
		<image class="top" src="/static/tabbar/partner/1.png" />
		<image class="bottom" src="/static/tabbar/partner/2.png" />
		<lss-button position="button" @click="onSubmit">马上加入成为创客</lss-button>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import lssButton from '@/components/lss/lss-button';
export default {
	components: {
		lssButton
	},
	data() {
		return {
			amount: '399'
		};
	},
	props: {},
	created() {},
	onLoad() {},
	methods: {
		onSubmit() {
			util.showBusy();
			util
				.md5Ajax({
					funcode: '0184',
					encrypt: {
						data: {
							user_agentid: $$get.login('taccountid')
						}
					},
					request: {
						amount: this.amount
					}
				})
				.then(response => {
					util.hideBusy();
					util.gotoPage(
						`./order?order_id=${response.data.order_id}&amount=${this.amount}`
					);
				})
				.catch(err => {
					util.hideBusy();
					util.showToast(err.data.retMsg);
				});
		}
	}
};
</script>

<style lang="scss">
page {
	height: calc(100% - 20rpx);
}

.top {
	width: 700rpx;
	height: 300rpx;
	margin: 20rpx auto;
	display: block;
}

.bottom {
	width: 750rpx;
	height: 556rpx;
	padding-bottom: 100rpx;
}
</style>
