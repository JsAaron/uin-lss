<template>
	<view class="bank-card">
		<!-- 多卡增加的时候处理 -->
		<block v-if="addMore">
			<!-- 增加卡的时候，步骤只有2个 -->
			<view class="bank-card__steps">
				<view class="bank-card__wapper bank-card__wapper--active" @tap="onStep2">
					<view class="bank-card__icon bank-card--text" :class="{ 'bank-card--active': stepClass2 }">
						<text>1</text>
					</view>
				</view>
				<view class="bank-card__wapper bank-card__wapper--active"><text class="bank-card__line"></text></view>
				<view class="bank-card__wapper bank-card__wapper--active" @tap="onStep3">
					<view class="bank-card__icon bank-card--text" :class="{ 'bank-card--active': stepClass3 }">
						<text>2</text>
					</view>
				</view>
			</view>
			<!-- 单独增加 -->
			<view class="bank-card__add">
				<view class="bank-card__content-card">
					<label class="bank-card__content-label">持卡人</label>
					<input class="bank-card__content-input" :value="userName" disabled />
				</view>
				<view class="bank-card__content-card">
					<label class="bank-card__content-label">身份证</label>
					<input class="bank-card__content-input" :value="idcard" disabled />
				</view>
			</view>
		</block>
		<block v-else>
			<!-- 进度条 -->
			<view class="bank-card__steps">
				<view class="bank-card__wapper bank-card__wapper--active" @tap="onStep1">
					<view class="bank-card__icon bank-card--text" :class="{ 'bank-card--active': stepClass1 }">
						<text>1</text>
					</view>
				</view>
				<view class="bank-card__wapper bank-card__wapper--active"><text class="bank-card__line"></text></view>
				<view class="bank-card__wapper bank-card__wapper--active" @tap="onStep2">
					<view class="bank-card__icon bank-card--text" :class="{ 'bank-card--active': stepClass2 }">
						<text>2</text>
					</view>
				</view>
				<view class="bank-card__wapper bank-card__wapper--active"><text class="bank-card__line"></text></view>
				<view class="bank-card__wapper bank-card__wapper--active" @tap="onStep3">
					<view class="bank-card__icon bank-card--text" :class="{ 'bank-card--active': stepClass3 }">
						<text>3</text>
					</view>
				</view>
			</view>
		</block>

		<!-- 绑定文本框 -->
		<view class="bank-card__content">
			<!-- 步骤1 -->
			<view v-if="step === 1">
				<inputs
					:inputsArray="inputsArray1"
					@activeFc="onNextPage1"
					:buttonStyle="buttonStyle"
					activeName="下一步"
					:fontSizeScaleSet="fontSizeScaleSet"
				/>
			</view>

			<!-- 步骤2 -->
			<view v-if="step === 2">
				<inputs
					:inputsArray="inputsArray2"
					@activeFc="onNextPage2"
					:buttonStyle="buttonStyle"
					activeName="下一步"
					:fontSizeScaleSet="fontSizeScaleSet"
				/>
			</view>

			<!-- 步骤3 -->
			<view v-if="step === 3">
				<inputs
					ifCode
					:otherSet="otherSet"
					:inputsArray="inputsArray3"
					@activeFc="onNextPage3"
					:buttonStyle="buttonStyle"
					activeName="绑卡"
					:fontSizeScaleSet="fontSizeScaleSet"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import lssButton from '@/components/lss-button';
export default {
	components: {
		lssButton
	},
	data() {
		return {
			fontSizeScaleSet: {
				allScale: 0.04
			},
			buttonStyle: {
				activeButton: 'background-color: #4f96ff;box-shadow: 2px 2px 1px 1px #4f96ff;',
				getcodeButton: 'background-color: #4f96ff;'
			},
			otherSet: {
				getCodeSet: {
					securityCodePlaceholder: '输入短信验证码',
					phoneNum: '',
					customId: 'add-back-card' //自定义标识
				},
				segmentationTitleSet: {
					segmentationTitleFontSizeScale: 0.032,
					segmentationTitleStyle: 'color: #f5105c;'
				}
			},
			inputsArray1: [
				{
					inputType: 'text',
					placeholder: '请输入持卡人姓名',
					title: '持卡人',
					verifyType: 'Chinese',
					verifyErr: '姓名必须是中文'
				},
				{
					inputType: 'idcard',
					title: '身份证',
					verifyType: 'idCart',
					verifyErr: '身份证号码输入有误'
				}
			],
			inputsArray2: [
				{
					title: '银行卡',
					verifyType: 'Number',
					verifyErr: '银行卡必须是数字'
				},
				{
					inputType: 'number',
					title: '手机号',
					maxlength: 11,
					verifyType: 'Tel',
					verifyErr: '手机号码输入有误'
				}
			],
			inputsArray3: [
				{
					inputType: 'number',
					segmentationTitle: '请输入信用卡背后签名栏的最后三位数',
					border_top: '1px solid #f2f2f2', //上划线
					title: 'CVV2',
					maxlength: 3,
					verifyType: 'Number',
					verifyErr: '银行卡必须是数字',
					hide: true
				},
				{
					inputType: 'number',
					segmentationTitle: '有效日期格式月年.如(0421)',
					border_top: '1px solid #f2f2f2', //上划线
					title: '有效期',
					maxlength: 4,
					verifyType: 'Tel',
					verifyErr: '手机号码输入有误',
					hide: true
				}
			],

			// 步骤流程
			step: 1,
			//激活样式
			stepClass1: true,
			stepClass2: false,
			stepClass3: false,

			userName: '',
			idcard: '',
			addMore: false
		};
	},
	onLoad(options) {
		if (options) {
			//添加多张卡
			// options.userInfo = `{"idcard":"430902198605260015","name":"陈文"}`;
			if (options.userInfo) {
				const userInfo = JSON.parse(options.userInfo);
				if (userInfo.name && userInfo.idcard) {
					this.userName = userInfo.name;
					this.idcard = userInfo.idcard;
					this.addMore = true;
					this.step = 2;
					this.stepClass2 = true;
				}
			}
		}
	},
	methods: {
		/**
		 * 注册第一步
		 */
		onNextPage1(res) {
			this.userName = res.data_0;
			this.idcard = res.data_1;
			util.showBusy();
			util
				.md5Ajax({
					funcode: '0079',
					encrypt: {
						data: {
							idcard: this.idcard,
							factname: this.userName
						}
					},
					request: {
						taccountId: $$get.login('taccountid')
					}
				})
				.then(() => {
					util.hideBusy();
					this.nextPage();
				})
				.catch(errResponse => {
					util.hideBusy();
					util.showToast(errResponse.data.retMsg);
				});
		},

		/**
		 * 注册第二步
		 */
		onNextPage2(res) {
			this.cardno = res.data_0;
			this.mobileno = res.data_1;
			util.showBusy();
			util
				.md5Ajax({
					funcode: '0080',
					encrypt: {
						data: {
							cardno: util.removeSpace(this.cardno),
							mobileno: this.mobileno
						}
					},
					request: {
						taccountId: $$get.login('taccountid')
					}
				})
				.then(response => {
					util.hideBusy();
					//信用卡
					if (response.data.iscs == 1) {
						this.inputsArray3[0].hide = false;
						this.inputsArray3[1].hide = false;
					}
					//更新手机号
					this.otherSet.getCodeSet.phoneNum = this.mobileno;
					this.nextPage();
				})
				.catch(errResponse => {
					util.hideBusy();
					util.showToast(errResponse.data.retMsg);
				});
		},

		/**
		 * 注册第三步
		 */
		onNextPage3(res) {
			util.showBusy('绑卡中...');
			const _data = {
				funcode: '0081',
				encrypt: {
					data: {
						cardno: util.removeSpace(this.cardno),
						mobileno: this.mobileno
					}
				},
				request: {
					randnum: res.randnum, //随机码
					vernum: res.vernum, //验证码
					cvn2: this.cvn2, //cvn2安全码
					validate: this.validate, //有效期
					taccountId: $$get.login('taccountid')
				}
			};
			util
				.md5Ajax(_data)
				.then(() => {
					util.hideBusy();
					util.showToast('success', '绑卡成功');
					//设置上个页面刷新
					getApp().globalData.setPageRefresh('prev');
					util.gotoPage('back', 2000);
				})
				.catch(errResponse => {
					util.hideBusy();
					util.showToast('fail', errResponse.data.retMsg);
				});
		},

		/**
		 * 切换下一页
		 */
		nextPage() {
			const next = this.step + 1;
			this.step = next;
			this['stepClass' + next] = true;
		},

		//========================
		//  步骤条
		//========================

		/**
		 * 设置步骤条
		 * @param {*} value
		 */
		setStep(value) {
			if (this.step > value) {
				for (var i = 1; i <= this.step; i++) {
					if (i > value) {
						this['stepClass' + i] = false;
					}
				}
				this.step = value;
			}
		},

		onStep1(e) {
			this.setStep(1);
		},
		onStep2() {
			this.setStep(2);
		},
		onStep3() {
			this.setStep(3);
		}
	}
};
</script>

<style lang="scss">
page {
	background: $background-color-white;
}

.button {
	width: 90%;
	margin: 80rpx auto 0 auto;
}

.set-card {
	font-size: 30rpx;
	margin-left: 140rpx;
	position: relative;
}

.bank-card {
	padding-top: 50rpx;

	&__add {
		margin-top: 50rpx;
	}
	&__steps {
		white-space: nowrap;
		display: flex;
		width: 400rpx;
		margin: 0 auto;
		text-align: center;
		color: #999;
	}

	&__button {
		margin-top: 50rpx;
	}

	&--active {
		color: $white !important;
		background: $background-color-blue !important;
		border-color: $background-color-blue !important;
	}
	&__wapper {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&__line {
		width: 100%;
		display: block;
		height: 2px;
		background: #999;
	}
	&--text {
		border-radius: 50%;
		border: 2px solid;
		border-color: #999;
	}
	&__icon {
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
	&__content {
		margin-top: 50rpx;
	}
	&__content-card {
		background: #ffffff;
		display: flex;
		align-items: center;
		height: 55rpx;
		border-bottom: 1px solid #d7d7d7;
		padding: 30rpx;
		input {
			width: 100%;
			@extend .set-card;
		}
	}
	&__content-input {
		color: $gray-dark;
	}
	&__content-label {
		font-size: 30rpx;
		margin-right: 30rpx;
		font-weight: 700;
		position: absolute;
		display: inline-block;
		width: 120rpx;
		text-align: center;
		overflow: hidden;
	}
	&__content-number {
		width: 100%;
		font-size: 30rpx;
		margin-left: 140rpx;
		position: relative;
		@extend .set-card;
	}
	&__register-input {
		width: 250rpx;
	}
	&__register-button {
		display: inline-block;
		font-size: 14px;
		background: none;
		color: #666;
		z-index: 100;
	}
	&__code {
		color: #fff;
		// background: $main-color;
		border-radius: 7rpx;
		font-size: 22rpx;
		padding: 5rpx 20rpx;
		position: absolute;
		right: 30rpx;
		&:active {
			background: $gray-dark;
		}
		&--active {
			background: $gray-dark;
		}
	}
}
</style>
