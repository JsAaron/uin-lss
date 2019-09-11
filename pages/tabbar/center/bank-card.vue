<template>
	<view>
		<payment-password
		  ref="pay"
			:show="payFlag"
			:forget="true"
			digits="6"
			@submit="onCheckPwd"
			@cancel="togglePayment"
		></payment-password>
		<view v-if="hasCard" class="bank-card">
			<block v-for="(item, index) in listData" :key="index">
				<view class="bank-card__my-card lss-background-active--opacity" :data-index="index" @longpress="onDeleteCard">
					<view class="bank-card__image_v1">
						<view class="bank-card__image_v2"><image class="bank-card__image" :src="getUrl(item.icon)" /></view>
					</view>
					<view class="bank-card__text">
						<text class="bank-card--text1">{{ item.bankname }}</text>
						<text class="bank-card--text2">{{ item.banktype }}</text>
						<text class="bank-card--text3">{{ item.bankaccount }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="bank-card__add lss-hairline--bottom--black bank-card__add--active" @tap="onAddCard">
			<text class="bank-card__add-text">添加银行卡</text>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import paymentPassword from '@/components/payment-password/payment-password';
export default {
	components: {
		paymentPassword
	},
	data() {
		return {
			payFlag: false,

			banklist: [], //银行卡列表
			deleteIndex:'',//删除的索引

			hasCard: false,
			listData: [],
			userInfo: {}
		};
	},
	props: {},

	onLoad() {
		this.updateBackCard();
	},

	onShow() {
		//如果需要刷新页面
		if (getApp().globalData.getPageRefresh()) {
			this.updateBackCard();
		}
	},

	methods: {
		getUrl(icon) {
			return `${this.$api.imgDomain}/images/${icon}@2x.png`;
		},

		/**
		 * 更新卡
		 */
		updateBackCard() {
			util.showBusy();
			this.getListData()
				.then(() => util.hideBusy())
				.catch(() => util.hideBusy());
		},

		/**
		 * 获取银行卡数据
		 */
		getListData() {
			return new Promise((resolve, reject) => {
				util
					.getBankList()
					.then(response => {
						//银行列表
						this.banklist = response.data.banklist;
						//获取用户绑定的卡
						this.getBindCard()
							.then(response => {
								if (response.data.banklist.length) {
									const listData = response.data.banklist.map(item => {
										return {
											icon: item.bankico, //如果有数据了，重设银行标记
											banktype: item.cardType == 1 ? '信用卡' : '储蓄卡',
											bankname: this.getBindName(item.bankico),
											bankuserid: item.bankuserid,
											bankaccount: item.bankaccount
										};
									});
									this.userInfo = {
										idcard: response.data.banklist[0].cert_no,
										name: response.data.banklist[0].drawname
									};
									this.listData = listData;
									this.hasCard = true;
								}
								resolve();
							})
							.catch(reject);
					})
					.catch(reject);
			});
		},

		/**
		 * 获取银行名字
		 */
		getBindName(bankico) {
			let bankname;
			this.banklist.map(item => {
				if (item.bankico === bankico) {
					bankname = item.bankname;
				}
			});
			return bankname;
		},

		/**
		 * 获取绑定银行卡列表
		 */
		getBindCard() {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0006',
							taccountid: $$get.login('taccountid')
						}
					})
					.then(resolve)
					.catch(() => {
						reject('银行卡获取失败！');
					});
			});
		},

		/**
		 * 增加绑定
		 */
		onAddCard() {
			util.gotoPage(`/pages/common/add-bank-card?userInfo=${JSON.stringify(this.userInfo)}`);
		},

		//==========删除绑定银行卡=============

		/**
		 * 删除绑定银行卡
		 */
		deleteCard(index) {
			const deleteData = this.listData[this.deleteIndex];
			if (deleteData) {
				util
					.unifyAjax({
						data: {
							funcode: '0025',
							bankuserid: deleteData.bankuserid
						}
					})
					.then(() => {
						util.showToast('success', '解绑成功');
						// 更新卡数据
						this.listData = this.listData.splice(index, 1);
						this.togglePayment()
					})
					.catch(errResponse => {
						util.showToast('fail', errResponse.data.retMsg);
					});
			}
		},

		togglePayment() {
			this.payFlag = !this.payFlag;
		},

		/**
		 * 检测密码
		 */
		onCheckPwd(password) {
			util.showBusy('验证密码...');
			util
				.verifyPassword({
					code: '805013',
					password: String(password),
					mobileno: $$get.login('mobileno'),
					money: String(10),
					agentid: $$get.login('taccountid'), //用户id
					parent_agentid: '7080007' //固定商户id
				})
				.then(couponInfo => {
					util.hideBusy();
					this.deleteCard();
				})
				.catch(error => {
					util.hideBusy();
					if (error) {
						if (error.data) {
							util.showToast(error.data.data.Mesg);
						} else {
							console.log(error);
						}
					}
					this.$refs.pay.emptyPassword()
				});
		},

		onDeleteCard(e) {
			wx.showModal({
				content: '解绑银行卡',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.deleteIndex = e.currentTarget.dataset.index
						this.togglePayment();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: rgb(48, 48, 48);
	height: calc(100% - 30rpx);
}

.bank-card {
	width: 96%;
	margin-left: 2%;

	&__my-card {
		@include flex-h-left;
		height: 180rpx;
		background: $blue;
		border-radius: 3px;
		margin-top: 30rpx;
	}

	&__image_v1 {
		@include flex-h;
		width: 120rpx;
	}

	&__image_v2 {
		width: 86rpx;
		height: 86rpx;
		border-radius: 50%;
		overflow: hidden;
		padding: 12rpx;
		background: #fff;
		box-sizing: border-box;
	}

	&__image {
		width: 100%;
		height: 100%;
	}

	&__text {
		@include flex-v-left;
		color: $white;
	}

	&--text1 {
		font-size: 30rpx;
	}

	&--text2 {
		font-size: 22rpx;
		color: $gray-light;
	}

	&--text3 {
		font-size: 40rpx;
		margin-top: 10rpx;
	}

	&__add {
		@include flex-h-left;
		height: 100rpx;
		margin-top: 20rpx;
		color: #fff;
		background: #555555;
		width: calc(100% - 40rpx);
		margin-left: 20rpx;
	}

	&__add-icon {
		margin-left: 20rpx;
	}

	&__add-text {
		margin-left: 20rpx;
	}

	&__add--active {
		&:active {
			background: #2b2b2b;
		}
	}
}

.bank-card input,
.bank-card-number {
	width: 100%;
	height: 100%;
}

/* 步骤 */

.bankcard .steps {
	white-space: nowrap;
	display: flex;
	width: 400rpx;
	margin: 0 auto;
	margin-top: 50rpx;
	text-align: center;
	color: #999;
}

.bankcard .steps .step-wapper {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.bankcard .steps .step-wapper .line {
	width: 100%;
	display: block;
	height: 2px;
	background: #999;
}

.bankcard .steps .is-text {
	border-radius: 50%;
	border: 2px solid;
	border-color: #999;
}

.step-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50rpx;
	height: 50rpx;
	font-size: 30rpx;
	background: #fff;
	text-align: center;
	line-height: 50rpx;
}

.bankcard .steps .step-wapper .active {
	color: #fff;
	background: #d43b33;
	border-color: #d43b33;
}

/* 开始绑定 */

.bankcard .content {
	margin-top: 50rpx;
}

.bind-bank-card input,
.bank-card-number {
	width: 100%;
}

.bank-card-number {
	font-size: 30rpx;
	margin-left: 140rpx;
	position: relative;
}

.bankcard .bind-bank-card {
	background: #ffffff;
	display: flex;
	align-items: center;
	height: 55rpx;
	border-bottom: 1px solid #d7d7d7;
	padding: 30rpx;
}

.bankcard .bind-bank-card > label {
	font-size: 30rpx;
	margin-right: 30rpx;
	font-weight: 700;
	position: absolute;
	display: inline-block;
	width: 120rpx;
	text-align: center;
	overflow: hidden;
}

.bind-bank-card > input,
.bind-bank-card picker,
.bind-bank-card .bankcard-group,
.bank-card-number {
	font-size: 30rpx;
	margin-left: 140rpx;
	position: relative;
}

.reg-input input {
	width: 250rpx;
}

.reg-input > button {
	display: inline-block;
	font-size: 14px;
	background: none;
	color: #666;
	z-index: 100;
}

.get-code {
	border: 1px solid red;
	border-radius: 15rpx;
	font-size: 25rpx;
	padding: 10rpx;
	position: absolute;
	right: 50rpx;
}
</style>
