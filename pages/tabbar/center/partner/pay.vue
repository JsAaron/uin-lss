<template>
	<view>
		<lss-payment :dataSet="dataSet">
			<view class="header">
				<view class="header__row">
					<label class="header__label">昵称</label>
					<text class="header__text">{{ title }}</text>
				</view>
				<view class="header__row">
					<label class="header__label">付款金额</label>
					<text>￥{{ money }}</text>
				</view>
				<view class="header__row">
					<label class="header__label">手机号</label>
					<text>{{ telephone }}</text>
				</view>
				<view class="header__row">
					<label class="header__label">收货地址</label>
					<text class="header__text">{{ address }}</text>
				</view>
			</view>
		</lss-payment>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import lssPayment from '@/pages/common/payment';
export default {
	components: {
		lssPayment
	},
	data() {
		return {
			title: '',
			money: '',
			telephone: '',
			address: '',
			dataSet: {
				order_id: '',
				money: '',
				is_royalty: '',
				is_fx: '',
				agentid: ''
			}
		};
	},
	props: {},
	created() {},
	onLoad(options) {
		options.data = `{"order_id":"2019091317562380172","amount":"0.01","consignee":"陈文","telephone":"13411111111","address":"是打发送达方式123是打发是"}`;
		let data = JSON.parse(options.data);
		this.dataSet = {
			order_id: data.order_id,
			title: data.consignee,
			money: data.amount,
			telephone: data.telephone,
			address: data.address,
			agentid: '7080007'
		};
	},
	methods: {}
};
</script>

<style lang="scss"></style>
