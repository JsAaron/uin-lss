<template>
	<view>
		<inputs ref="inputs" @activeFc="activeFc" :inputsArray="inputsArray" :buttonStyle="buttonStyle" :fontSizeScaleSet="fontSizeScaleSet" />
		<lss-button type="submit" @click="onSubmit">确定修改</lss-button>
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
			old_password: '',
			new_password: '',
			ensure_new_password: '',

			//input配置
			fontSizeScaleSet: {
				allScale: 0.04
			},
			buttonStyle: {
				activeButton: 'width:80%;margin:0 auto;;height:90rpx;background-color: #4f96ff;box-shadow: 2px 2px 1px 1px #4f96ff;',
				getcodeButton: 'background-color: #4f96ff;'
			},
			inputsArray: [
				{
					segmentationTitle: '输入旧密码',
					border_top: '1px solid #f2f2f2',
					placeholder: '输入6位旧密码',
					title: '旧密码',
					password: true,
					verifyType: 'Number6',
					maxlength: 6,
					variableName: 'old_password'
				},
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
		uni.setNavigationBarTitle({
			title: this.pageMode == 'pay' ? '修改支付密码' : '修改登录密码'
		});
	},
	methods: {
		onSubmit() {
			this.$refs.inputs.activeFc();
		},

		/**
		 * 修改密码
		 */
		amendChange(res) {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0010',
							pwdtype: this.pageMode == 'pay' ? '2' : '1',
							oldpwd: res.old_password,
							newpwd: res.new_password,
							userid: $$get.login('userid')
						}
					})
					.then(resolve)
					.catch(reject);
			});
		},

		activeFc(res) {
			util.showBusy();
			this.amendChange(res)
				.then(response => {
					util.hideBusy();
					util.showToast('success', '密码修改成功');
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

<style lang="scss"></style>
