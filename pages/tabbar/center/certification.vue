<template>
	<view>
		<view class="applyData">
			<view class="applyData__header">
				<image class="applyData__image--logo" src="/static/tabbar/certification/0.png" />
				<view class="applyData__header-wapper">
					<image class="applyData__image--avatar" :src="avatarUrl" />
					<text class="applyData__text--avatar">{{ avatarName }}</text>
					<text>{{ node }}</text>
				</view>
			</view>
		</view>

		<view class="applyData__body">
			<view class="applyData__card lss-hairline--bottom">
				<image class="applyData__image--card" src="/static/tabbar/certification/1.png" />
				<text>实名认证</text>
			</view>
			<block>
				<view class="applyData__id-card lss-hairline--bottom">
					<view class="applyData__card-view">
						<view class="applyData__image--id-card" data-type="front" @tap="onUploadImage">
							<image
								:src="
									frontImageLocalPath
										? imgDomain + '/agentimg/' + frontImageLocalPath
										: '/static/identity/1.jpg'
								"
							/>
						</view>
						<text>身份证正面</text>
					</view>
					<view class="applyData__card-view">
						<view class="applyData__image--id-card" data-type="back" @tap="onUploadImage">
							<image
								:src="
									backImageLocalPath
										? imgDomain + '/agentimg/' + backImageLocalPath
										: '/static/identity/2.jpg'
								"
							/>
						</view>
						<text>身份证反面</text>
					</view>
					<view class="applyData__card-view">
						<view class="applyData__image--id-card" data-type="hand" @tap="onUploadImage">
							<image
								:src="
									handImageLocalPath
										? imgDomain + '/agentimg/' + handImageLocalPath
										: '/static/identity/3.jpg'
								"
							/>
						</view>
						<text>手持正面照</text>
					</view>
				</view>
			</block>
		</view>

		<view class="certification-view">
			<inputs
				:inputsArray="inputsArray"
				@activeFc="onSubmit"
				:buttonStyle="buttonStyle"
				activeName="提交认证"
				:fontSizeScaleSet="fontSizeScaleSet"
			/>
		</view>

		<scan-ocr :dataSet.sync="scanData" @complete="sacnComplete"></scan-ocr>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import scanOcr from '@/components/scan-ocr';
export default {
	components: {
		scanOcr
	},
	data() {
		return {
			showScan: false,
			scanData: {},

			platform: '',
			avatarUrl: '',
			avatarName: '',

			factname: '',
			idcard: '',
			imgDomain: '',

			frontImageLocalPath: '',
			backImageLocalPath: '',
			handImageLocalPath: '',

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
			inputsArray: [
				{
					inputType: 'text',
					content: '上传身份证照片自动识别',
					title: '真实姓名',
					type: 'text'
				},
				{
					inputType: 'idcard',
					content: '上传身份证照片自动识别',
					title: '身份证号',
					type: 'text'
				}
			]
		};
	},

	onLoad() {
		this.imgDomain = this.$api.imgDomain;
		this.platform = $$get.login('platform');
		this.avatarUrl = $$get.login('avatarUrl');
		this.avatarName = $$get.login('facename') || $$get.userInfo('nickName');
	},
	methods: {
		//=====================
		// 提交
		//=====================

		/**
		 * 验证数据
		 */
		verifyData() {
			if (!this.factname) {
				util.showToast('请输入姓名');
				return false;
			}
			if (!this.idcard) {
				util.showToast('请输入身份证号码');
				return false;
			}
			if (!this.frontImageLocalPath) {
				util.showToast('请上传身份证正面照');
				return false;
			}
			if (!this.backImageLocalPath) {
				util.showToast('请上传身份证反面照');
				return false;
			}
			if (!this.handImageLocalPath) {
				util.showToast('请上传身份证手持照');
				return false;
			}
			return true;
		},

		/**
		 * 注册
		 */
		sendReginster() {
			return new Promise((resolve, reject) => {
				let request = {
					factname: this.factname, //真实姓名
					idcard: this.idcard,
					zmImage: this.frontImageLocalPath, //身份证正面照片
					fmImage: this.backImageLocalPath, //身份证反面照片
					scsfzImage: this.handImageLocalPath //身份证手持照片
				};
				util
					.md5Ajax({
						funcode: '0004',
						encrypt: {
							data: {
								agentid: $$get.login('taccountid')
							}
						},
						request: request
					})
					.then(resolve)
					.catch(reject);
			});
		},

		/**
		 * 提交注册
		 */
		onSubmit() {
			// 验证数据
			if (!this.verifyData()) {
				return;
			}
			util.showBusy();
			this.sendReginster()
				.then(() => {
					this.$api
						.accessLogin()
						.then(() => {
							util.hideBusy();
							util.showToast('success', '认证成功', 2000);
							util.gotoPage('back', 2000);
						})
						.catch(() => {
							util.hideBusy();
						});
				})
				.catch(errResponse => {
					util.hideBusy();
					util.showToast(errResponse.data.retMsg);
				});
		},

		onUploadImage(e) {
			switch (e.currentTarget.dataset.type) {
				case 'front':
					this.scanData = {
						type: '2',
						side: 'front',
						title: '身份证正面照'
					};
					break;
				case 'back':
					this.scanData = {
						title: '身份证反面照',
						type: '2',
						side: 'back'
					};
					break;
				case 'hand':
					this.scanData = {
						title: '手持身份证正面照',
						noVerify: true,
						side: 'hand',
						devicePosition: 'front'
					};
					break;
			}
		},

		/**
		 * 扫描完成
		 */
		sacnComplete(data) {
			if (data.side == 'front') {
				this.inputsArray[0].content = data.name;
				this.factname = data.name;
				this.inputsArray[1].content = data.id_card;
				this.idcard = data.id_card;
				util.uploadFile({ path: data.image }).then(fileName => {
					this.frontImageLocalPath = fileName;
				});
			}
			if (data.side == 'back') {
				util.uploadFile({ path: data.image }).then(fileName => {
					this.backImageLocalPath = fileName;
				});
			}
			if (data.side == 'hand') {
				util.uploadFile({ path: data.image }).then(fileName => {
					this.handImageLocalPath = fileName;
				});
			}
		}
	}
};
</script>

<style lang="scss">
.applyData {
	font-size: 30rpx;

	&__image {
		&--logo {
			width: 100%;
			height: 264rpx;
		}

		&--avatar {
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
		}

		&--card {
			width: 48rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}

		&--id-card {
			@include flex-h;
			width: 230rpx;
			height: 150rpx;
			background: #ccc;
			border-radius: 10rpx;
		}
		&--gps {
			width: 24rpx;
			height: 24rpx;
			margin-right: 30rpx;
		}
	}

	&__text {
		&--avatar {
			color: #ffffff;
		}
	}

	&__header {
		position: relative;
		width: 100%;
		height: 264rpx;
	}

	&__header-wapper {
		@include position-center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__body {
		background: #ffffff;
	}

	&__card {
		@include flex-h-left;
		padding: 20rpx;
	}

	&__id-card {
		@include flex-h-around;
		margin: 20rpx 0;
		padding-bottom: 20rpx;

		image {
			width: 201rpx;
			height: 134rpx;
		}
	}

	&__card-view {
		@include flex-v text {
			margin-top: 10rpx;
			font-size: 25rpx;
		}
	}

	&__button {
		margin: 30rpx auto;
		background: #b2b2b2;
		&--active {
			background: $background-color-blue;
		}
	}
}
</style>
