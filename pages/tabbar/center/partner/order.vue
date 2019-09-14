<template>
	<view>
		<view class="order">
			<inputs
				ref="inputs"
				@activeFc="activeFc"
				:inputsArray="inputsArray"
				:buttonStyle="buttonStyle"
				:fontSizeScaleSet="fontSizeScaleSet"
			/>
			<image class="bottom" src="/static/tabbar/partner/2.png" />
			<view class="order__row lss-hairline--bottom">
				<label class="order__label">配送方式：</label>
				<text>快递免邮</text>
			</view>
		</view>
		<lss-button position="button" @click="onSubmit">马上加入成为创客</lss-button>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import lssButton from '@/components/lss/lss-button';
export default {
	components: { lssButton },
	data() {
		return {
			order_id: '',
			amount: '',

			//input配置
			fontSizeScaleSet: {
				allScale: 0.04
			},
			buttonStyle: {
				activeButton: 'background-color: #4f96ff;box-shadow: 2px 2px 1px 1px #4f96ff;',
				getcodeButton: 'background-color: #4f96ff;'
			},
			inputsArray: [
				{
					variableName: 'consignee',
					title: '收货人',
					verifyType: 'Chinese'
				},
				{
					variableName: 'telephone',
					title: '联系电话',
					verifyType: 'Tel'
				},
				{
					variableName: 'address',
					title: '收货地址'
				}
			]
		};
	},
	onLoad(options) {
		this.order_id = options.order_id;
		this.amount = options.amount;
	},
	methods: {
		activeFc(res) {
			util.showBusy();
			util
				.md5Ajax({
					funcode: '0186',
					encrypt: {
						data: {
							user_agentid: $$get.login('taccountid'),
							order_id: this.order_id
						}
					},
					request: {
						consignee: res.consignee,
						telephone: res.telephone,
						address: res.address
					}
				})
				.then(() => {
					util.hideBusy();
					let data = {
						order_id: this.order_id,
						amount: this.amount,
						consignee: res.consignee,
						telephone: res.telephone,
						address: res.address
					};
					util.gotoPage(`./pay?data=${JSON.stringify(data)}`);
				});
		},
		onSubmit() {
			this.$refs.inputs.activeFc();
		}
	}
};
</script>

<style lang="scss">
.order {
	background: $white;

	&__row {
		@include flex-h-between;
		padding: 20rpx;
		color: $text-color-gray;
	}

	&__input {
		width: 500rpx;
	}

	margin-bottom: 100rpx;
}

.bottom {
	width: 750rpx;
	height: 556rpx;
}
</style>
