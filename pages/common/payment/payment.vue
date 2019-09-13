<template>
	<view class="applyPay">
		<view class="applyPay__header">
			<text class="applyPay__title">购买信息</text>
			<slot />
		</view>

		<view class="applyPay__pay">
			<text class="applyPay__pay-title">选择支付方式</text>
			<radio-group bindchange="payRadioChange">
				<!-- 微信支付 -->
				<view
					class="applyPay__pay-card lss-hairline--bottom"
					data-value="weixin"
					@tap="payChange"
				>
					<view class="applyPay__card-row">
						<image class="applyPay__pay-image" src="/static/pubilc/weixinzhifu.png" />
						<view><text>微信支付</text></view>
					</view>
					<radio color="#4f96ff" value="weixin" :checked="payType == 'weixin'" />
				</view>
				<!-- 零钱 -->
				<view
					class="applyPay__pay-card lss-hairline--bottom"
					data-value="balance"
					@tap="payChange"
				>
					<view class="applyPay__card-row">
						<image class="applyPay__pay-image" src="/static/pubilc/money.png" />
						<view>
							<text>零钱支付</text>
							<text class="applyPay__pay-text--small">(剩余￥{{ balance }})</text>
						</view>
					</view>
					<radio color="#4f96ff" value="balance" :checked="payType == 'balance'" />
				</view>
				<block v-if="bankCardListData.length">
					<view
						v-for="(item, index) in bankCardListData"
						:key="index"
						class="applyPay__pay-card lss-hairline--bottom"
						:data-value="item.bankuserid"
						@tap="payChange"
					>
						<view class="applyPay__card-row">
							<image class="applyPay__pay-image" :src="item.image" />
							<view>
								<text>{{ item.title }}</text>
							</view>
						</view>
						<radio
							color="#4f96ff"
							:value="item.bankuserid"
							:checked="payType == item.bankuserid"
						/>
					</view>
				</block>
				<view class="applyPay__pay-card" data-value="add" @tap="payChange">
					<view class="applyPay__card-row">
						<image class="applyPay__pay-image" src="/static/pubilc/add.png" />
						<text>添加银行卡</text>
					</view>
					<radio color="#4f96ff" value="add" :checked="payType == 'add'" />
				</view>
			</radio-group>
		</view>

		<view @tap="submitButton" class="applyPay__button">
			<view class="applyPay__button--half applyPay__button--money">
				<text>￥{{ money }}元</text>
			</view>
			<view class="applyPay__button--half applyPay__button--pay">
				<text>
					{{ !payType ? '选择支付方式' : payType == 'add' ? '添加银行卡' : '确定支付' }}
				</text>
			</view>
		</view>

		<payment-password
			ref="pay"
			:show="payFlag"
			:forget="true"
			digits="6"
			@submit="onCheckPwd"
			@cancel="togglePayment"
		></payment-password>

		<verify-box v-if="verifyFlag" @click="onGetVerify"></verify-box>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import verifyBox from './verify-box';
import paymentPassword from '@/components/payment-password/payment-password';
export default {
	components: {
		verifyBox,
		paymentPassword
	},
	props: {
		dataSet: {
			type: Object,
			default() {
				return {
					//订单id，给创客使用
					//不需要后续再更新订单
					order_id: '',
					//金额
					money: '',
					//收款人id
					agentid: '',
					//是否返佣
					//1 针对服务商，不返佣
					//为空都是返佣
					is_fx: '',
					//is_royalty（开通创客传1）;//用户提成返佣，0-不需要,1-需要
					//s_royalty（0-创客支付不返佣，1-创客支付返佣）
					//is_fx（0-消费返佣，1-消费不返佣）
					is_royalty: '0'
				};
			}
		}
	},
	data() {
		return {
			//订单id，给创客使用
			//不需要后续再更新订单
			order_id: '',
			//金额
			money: '',
			//收款人id
			agentid: '',
			//是否返佣
			//1 针对服务商，不返佣
			//为空都是返佣
			is_fx: '',
			//is_royalty（开通创客传1）;//用户提成返佣，0-不需要,1-需要
			//s_royalty（0-创客支付不返佣，1-创客支付返佣）
			//is_fx（0-消费返佣，1-消费不返佣）
			is_royalty: '0',

			//余额
			balance: 0,
			payType: 'weixin',
			polling_count: 5, //最多轮询5次
			bankCardListData: [],
			bankCardData: {},
			/**
			 * 银行卡有外部接口
			 * 需要有个外部操作
			 */
			refresh: false,

			/**
			 * 密码框
			 */
			payFlag: false,
			verifyFlag: true //快捷支付
		};
	},
	watch: {
		dataSet(val) {
			for (let key in val) {
				if (val[key]) {
					this[key] = val[key];
				}
			}
			this.initData();
		}
	},

	methods: {
		initData() {
			//零钱
			const balance = this.queryBalance().then(response => {
				this.balance = response.data.availamount || 0;
			});

			//银行卡
			const card = this.initBankCard();

			Promise.all([balance, card])
				.then(result => {
					util.hideBusy();
				})
				.catch(() => {
					util.hideBusy();
				});
		},

		/**
		 * 初始化银行卡数据
		 */
		initBankCard() {
			return new Promise((resolve, reject) => {
				util
					.getBankCardAssembly($$get.login('taccountid'))
					.then(listData => {
						if (listData) {
							this.refresh = false;
							this.bankCardListData = listData;
						}
						resolve(listData);
					})
					.catch(reject);
			});
		},

		//=================================
		//       支付代码 - 零钱支付
		//=================================

		/**
		 * 余额查询
		 */
		queryBalance() {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0013',
							taccountid: $$get.login('taccountid')
						}
					})
					.then(resolve)
					.catch(resolve);
			});
		},

		//=========== 选择 =============

		/**
		 * 支付类型选择
		 * @param {*} e
		 */
		payRadioChange(e) {
			this.payType = e.detail.value;
		},

		//整体改变
		payChange(e) {
			this.payType = e.currentTarget.dataset.value;
		},

		//=================================
		//       支付代码 - 微信支付
		//=================================

		callWeixinPay() {
			util.showBusy();
			let data = {
				funcode: '0165',
				je: this.money,
				is_fx: this.is_fx,
				order_id: this.order_id,
				is_royalty: this.is_royalty,
				card_id: '',
				openid: $$get.device('openid'),
				parent_agentid: this.agentid, //商户编号(商家的)
				agentid: $$get.login('taccountid') //商户编号(客户的)
			};
			console.log(data);
			util
				.unifyAjax({ data })
				.then(response => {
					util.hideBusy();
					let data = response.data;
					wx.requestPayment({
						timeStamp: data.timestamp2,
						nonceStr: data.noncestr,
						package: data.packageValue,
						signType: data.signType,
						paySign: data.sign2,
						success: res => {
							this.updatePayComplete(data.bodycontent, '微信');
						},
						fail: function(res) {
							util.showToast('微信支付失败');
						}
					});
				})
				.catch(res => {
					util.hideBusy();
					util.showToast(res.data.retMsg);
				});
		},

		//=================================
		//       支付代码 - 银行卡支付
		//=================================

		/**
		 * 调用银行卡支付
		 */
		callPassword() {
			this.payFlag = true;
		},

		togglePayment() {
			this.payFlag = !this.payFlag;
		},

		/**
		 * 支付密码框
		 */
		closePayFlag() {
			this.payFlag = false;
			this.$refs.pay.emptyPassword();
		},

		/**
		 * 检测密码
		 */
		onCheckPwd(password) {
			util.showBusy('验证密码');
			util
				.verifyPassword({
					code: '805013',
					password: String(password),
					mobileno: $$get.login('mobileno'),
					money: String(Number(this.money) * 100),
					agentid: $$get.login('taccountid'), //用户id
					parent_agentid: this.agentid //商户id
				})
				.then(() => {
					//创建订单
					this.createDeviceTrade();
				})
				.catch(error => {
					// 密码错误
					util.hideBusy();
					if (error) {
						if (error.data) {
							util.showToast(error.data.data.Mesg, 3000);
						} else {
							console.log(error);
						}
					}
					this.$refs.pay.emptyPassword();
				});
		},

		/**
		 * 验证快捷支付
		 */
		verifyFastPay() {
			util.showToast({
				title: `首次支付需要短信安全验证,请查收短信`,
				icon: 'none',
				duration: 5000
			});
			this.verifyFlag = true;
		},

		/**
		 * 获取快捷验证码
		 */
		onGetVerify(code) {
			//获取验证码后，重新支付
			this.createDeviceTrade(code);
			this.verifyFlag = false;
		},

		/**
		 * 创建交易订单
		 */
		createDeviceTrade(validateCode) {
			util.showBusy('正在支付');
			return new Promise((resolve, reject) => {
				const data = {
					is_new: 'new', //新版本
					code: '805017',
					validateCode: validateCode, //快捷绑卡验证码
					xx_no: String(this.bankCardData.xx_no),
					cardid: '',
					order_id: this.order_id,
					is_royalty: this.is_royalty,
					is_fx: this.is_fx,
					money: String(this.money * 100),
					agentid: $$get.login('taccountid'), //用户id
					parent_agentid: this.agentid //商户id
				};
				console.log('data', data);
				util
					.createBankCardTrade(data)
					.then(response => {
						//bodycontent 支付订单号
						const { equipment_order, isNeedBindCard, bodycontent } = response.data.data;

						//需要验证码开通快捷绑卡
						if (isNeedBindCard == '1') {
							util.hideBusy();
							this.closePayFlag()
							this.verifyFastPay();
						} else {
							// 等待订单支付结果
							if (equipment_order) {
								if (validateCode) {
									//如果验证码是成功了，关闭验证框
									this.closePayFlag()
								}
								this.polling_order(equipment_order, bodycontent);
							} else {
								util.hideBusy();
								util.showToast('fail', '支付失败');
							}
						}
					})
					.catch(error => {
						util.hideBusy();
						// 订单错误
						const message = error ? error.data.data.Mesg : '支付失败';
						util.showToast('fail', message);
						this.$refs.pay.emptyPassword();
					});
			});
		},

		/**
		 * 获取状态状态
		 */
		get_order_state(equipment_order, { success_callback, fail_callback, poll_callback }) {
			util
				.deviceAjax({
					data: {
						code: '805006',
						equipment_order
					}
				})
				.then(response => {
					let orderStatus = response.data.data.orderStatus;
					//支付成功
					if (orderStatus == 1) {
						success_callback && success_callback(response);
						return;
					}
					//支付失败
					if (orderStatus == 2) {
						fail_callback && fail_callback(response);
						return;
					}
					// 没有获取结果，继续
					if (orderStatus == 4) {
						poll_callback && poll_callback(response);
						return;
					}
				})
				.catch(error => {
					util.showToast(error.data.data.Mesg);
				});
		},

		/**
		 * 清理轮询
		 */
		clear_poll_timer() {
			if (this.polling_timer) {
				clearTimeout(this.polling_timer);
				this.polling_timer = null;
			}
			this.polling_count = 5;
		},

		/**
		 * 订单轮询
		 * 获取订单状态
		 */
		polling_order(equipment_order, bodycontent) {
			this.get_order_state(equipment_order, {
				success_callback: response => {
					util.hideBusy();
					this.clear_poll_timer();
					this.updatePayComplete(bodycontent, '银行卡');
				},
				fail_callback: response => {
					util.hideBusy();
					this.clear_poll_timer();
					util.showToast(response.data.data.payment_info, 3000);
				},
				//如果没有获取结果，继续处理
				poll_callback: () => {
					if (this.polling_count) {
						--this.polling_count;
						this.polling_timer = setTimeout(() => {
							this.polling_order(equipment_order, bodycontent);
						}, 2000);
					} else {
						util.hideBusy();
						this.clear_poll_timer();
						util.showToast('fail', '支付反馈超时,请在订单中查看支付结果', 3000);
					}
				}
			});
		},

		//================ 更新状态 =================

		/**
		 * 支付成功
		 */
		updatePayComplete(pay_order_id, pay_type) {
			util.hideBusy();
			util.showToast('success', '支付成功', 1000);
			this.$emit('complete', {
				pay_type,
				pay_order_id
			});
		},

		/**
		 * 确定按钮
		 */
		submitButton() {
			if (!this.payType) {
				util.showToast('请选择支付方式');
				return true;
			}

			// 微信支付
			if (this.payType === 'weixin') {
				return this.callWeixinPay();
			}

			// 零钱
			if (this.payType === 'balance') {
				return this.callLoosePay();
			}

			// 新增银行卡
			if (this.payType === 'add') {
				return util.gotoPage(`/pages/common/add-bank-card`);
			}

			//银行卡支付
			this.bankCardListData.map(item => {
				if (item.bankuserid == this.payType) {
					//单卡数据
					this.bankCardData = item;
					//验证密码
					this.callPassword();
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: rgb(242, 242, 242);
}
.wapper {
	width: 690rpx;
	margin: auto;
	background: #ffffff;
	font-weight: 700;
	border-radius: 10rpx;
}

.applyPay {
	font-size: 35rpx;
	padding: 20rpx 0 100rpx 0;

	&__header {
		@extend .wapper;
		padding-bottom: 20rpx;
	}

	&__pay {
		@extend .wapper;
	}

	&__title,
	&__pay-title {
		background: $background-color-blue;
		border-top-right-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		padding: 5rpx 10rpx 5rpx 5px;
	}

	&__info {
		@include flex-v-around;
	}

	&__text {
		&--small {
			font-size: 22rpx;
		}

		&--money {
			color: #fe7700;
		}
	}

	&__info-view {
		@include flex-h-around;
		width: 100%;
		padding: 10rpx 0;
	}

	&__info-text {
		margin-left: 20rpx;
	}

	&__info-left {
		@include flex-h-left;
		flex: 1;
		margin-left: 60rpx;
	}

	&__info-right {
		@include flex-h-left;
		flex: 1.8;
		margin-left: 20rpx;
	}

	&__pay {
		margin-top: 50rpx;
	}

	&__pay-image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	&__pay-text {
		&--small {
			font-size: 28rpx;
			color: $text-color-gray;
		}
	}

	&__card-row {
		@include flex-h-left;
		padding: 20rpx;
	}

	&__pay-card {
		@include flex-h-between;
		padding: 0 20rpx;
	}

	&__button {
		position: fixed;
		display: flex;
		bottom: 0;
		width: 100vw;
		height: 100rpx;
		background: #b2b2b2;
		text-align: center;
		border-radius: 0;
		color: #ffffff;
		z-index: 999;
		font-size: 35rpx;

		&--half {
			@include flex-h;
			flex: 1;
			height: 100%;
		}

		&--money {
			background: #ffffff;
			color: #fe0000;
		}

		&--pay {
			background: $background-color-blue;

			&:active {
				background: #b2b2b2;
			}
		}
	}
}
</style>
