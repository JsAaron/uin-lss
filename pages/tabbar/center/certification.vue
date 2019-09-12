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
							<!-- <image src="{{frontImageLocalPath?frontImageLocalPath:'/assets/images/register/1.jpg'}}" /> -->
						</view>
						<text>身份证正面</text>
					</view>
					<view class="applyData__card-view">
						<view class="applyData__image--id-card" data-type="back" @tap="onUploadImage">
							<!-- <image src="{{backImageLocalPath?bckImageLocalPath:'/assets/images/register/2.jpg'}}" /> -->
						</view>
						<text>身份证反面</text>
					</view>
					<view class="applyData__card-view">
						<view class="applyData__image--id-card" data-type="hand" @tap="onUploadImage">
							<!-- <image src="{{handImageLocalPath?handImageLocalPath:'/assets/images/register/3.jpg'}}" /> -->
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

		<scan-frame :dataSet.sync="scanData"></scan-frame>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import scanFrame from '@/components/scan-frame';
export default {
	components: {
		scanFrame
	},
	data() {
		return {
			showScan: false,
			scanData: {},

			platform: '',
			avatarUrl: '',
			avatarName: '',

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
					content: '扫描身份证图片自动识别',
					title: '真实姓名',
					type: 'text'
				},
				{
					inputType: 'idcard',
					content: '扫描身份证图片自动识别',
					title: '身份证号',
					type: 'text'
				}
			]
		};
	},
	props: {},
	created() {},
	onLoad() {
		this.platform = $$get.login('platform');
		this.avatarUrl = $$get.login('avatarUrl');
		this.avatarName = $$get.login('facename') || $$get.userInfo('nickName');
	},
	methods: {
		onUploadImage(e) {
			switch (e.currentTarget.dataset.type) {
				case 'front':
					this.scanData = {
						title: '身份证正面照'
					};
					break;
				case 'back':
					this.scanData = {
						title: '身份证反面照'
					};
					break;
				case 'hand':
					this.scanData = {
						title: '手持身份证正面照'
					};
					break;
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
