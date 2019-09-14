<template>
	<view>
		<block v-if="current == 0">
			<inputs
				ifCode
				ref="inputs_1"
				@activeFc="activeFc_1"
				:otherSet="otherSet"
				:inputsArray="inputsArray_1"
				:buttonStyle="buttonStyle"
				:fontSizeScaleSet="fontSizeScaleSet"
			/>
			<lss-button type="submit" @click="onSubmit_1">下一步</lss-button>
		</block>
		<block v-if="current == 1">
			<inputs
				ref="inputs_2"
				@activeFc="activeFc_2"
				:otherSet="otherSet"
				:inputsArray="inputsArray_2"
				:buttonStyle="buttonStyle"
				:fontSizeScaleSet="fontSizeScaleSet"
			/>
			<lss-button type="submit" @click="onSubmit_2">提交修改</lss-button>
		</block>
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
			pageMode: 'pay', //pay支付密码 login 登录密码
			current: 0,
			mobileno: '',

			//input配置
			fontSizeScaleSet: {
				allScale: 0.04
			},
			buttonStyle: {
				activeButton:
					'width:80%;margin:0 auto;;height:90rpx;background-color: #4f96ff;box-shadow: 2px 2px 1px 1px #4f96ff;',
				getcodeButton: 'background-color: #4f96ff;'
			},
			otherSet: {
				getCodeSet: {
					phoneNum: '',
					securityCodePlaceholder: '输入短信验证码',
					customId: 'reset-password' //自定义标识
				}
			},
			inputsArray_1: [
				{
					variableName: 'ttt',
					type: 'text',
					content: '',
					segmentationTitle: '获取短信验证码',
					border_top: '1px solid #f2f2f2',
					placeholder: '',
					title: '手机号码'
				}
			],
			inputsArray_2: [
				{
					segmentationTitle: '输入密码',
					border_top: '1px solid #f2f2f2',
					title: '新密码',
					placeholder: '输入6位新密码',
					password: true,
					maxlength: 6,
					verifyType: 'Number6',
					variableName: 'new_password'
				},
				{
					title: '确定密码',
					maxlength: 6,
					password: true,
					verifyType: 'Number6',
					placeholder: '确定6位新密码',
					variableName: 'ensure_new_password'
				}
			]
		};
	},
	onLoad(options) {
		options.pageMode = 'login';
		if (options.pageMode) {
			this.pageMode = options.pageMode;
		}
		wx.setNavigationBarTitle({
			title: this.pageMode == 'pay' ? '重设支付密码' : '重设登录密码'
		});
	},
	onReady() {
		this.mobileno = $$get.login('mobileno');
		let inputsArray_1 = [...this.inputsArray_1];
		inputsArray_1[0].content = this.mobileno;
		this.$refs.inputs_1.setValue(inputsArray_1);
		this.otherSet.getCodeSet.phoneNum = this.mobileno;
	},
	methods: {
		onSubmit_1() {
			this.$refs.inputs_1.activeFc();
		},
		onSubmit_2() {
			this.$refs.inputs_2.activeFc();
		},

		requeset_1(res) {
			return new Promise((resolve, reject) => {
				util
					.md5Ajax({
						funcode: '0011',
						encrypt: {
							data: {
								pwdtype: this.pageMode == 'pay' ? '2' : '1',
								mobileno: this.mobileno
							}
						},
						request: {
							userid: $$get.login('userid'),
							randnum: res.randnum, //随机码
							vernum: res.vernum //验证码
						}
					})
					.then(resolve)
					.catch(reject);
			});
		},

		activeFc_1(res) {
			util.showBusy();
			this.requeset_1(res)
				.then(response => {
					util.hideBusy();
					this.current = 1;
				})
				.catch(err => {
					util.hideBusy();
					util.showToast(err.data.retMsg);
				});
		},

		requeset_2(res) {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0012',
							newpwd: res.new_password,
							pwdtype: this.pageMode == 'pay' ? '2' : '1',
							mobileno: this.mobileno
						}
					})
					.then(resolve)
					.catch(reject);
			});
		},

		activeFc_2(res) {
			util.showBusy();
			this.requeset_2(res)
				.then(response => {
					util.hideBusy();
					util.showToast('success', '密码重置成功');
					util.gotoPage('back', 2000);
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
	page{
		background: $background-color-white;
	}
</style>
