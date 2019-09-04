<template>
	<view class="auth">
		<image src="/static/pubilc/accredit.png" class="img" mode="aspectFill"></image>
		<view class="describe">{{describe}}</view>
		<button @tap="onOpenSetting" class="btn">{{buttonText}}</button>
	</view>
</template>

<script>
	import * as util from '@/utils';

	export default {
		data() {
			return {
				describe: "", //描述
				buttonText: "" //按钮名称
			};
		},
		onLoad(options) {
			this.options = JSON.parse(options.data)
			this.isInit = true
			this.buttonText = this.options.buttonText
			this.describe = this.options.describe
		},

		onShow() {
			if (this.isInit) {
				this.isInit = false
				return
			}

			this.$api.showBusy()

			//重新检测
			util.detectAccredit(this.options.scope).then(() => {
				this.$api.hideBusy()
				this.$api.gotoPage("back")
			}).catch(() => {
				// 没有授权
				this.$api.hideBusy()
				this.$api.showModal({
					title: '温馨提示',
					showCancel: false,
					content: this.options.content
				})
			})
		},
		methods: {
			/**
			 * 必须手动启动
			 * 打开设置
			 */
			onOpenSetting() {
				uni.openSetting()
			}
		}
	}
</script>

<style lang="scss">
	.auth {
		@include flex-v(flex-start);
		background: $background-color-white;
		padding-top: 100rpx;
		height: calc(100vh - 100rpx);
	}

	.img {
		border-radius: 50%;
		margin: 0 0 60rpx;
		display: inline-block;
		width: 200rpx;
		height: 200rpx;
		line-height: 0;
	}

	.title {
		display: inline-block;
		width: 70%;
		margin: 0 0 60rpx;
	}

	.describe {
		color: #a7aaa9;
		font-size: 26rpx;
		margin: 0 0 60rpx;
		border-radius: 50%;
		text-align: center;
		width: 70%;
	}

	.btn {
		padding: 0 10rpx;
		background: #19be6b;
		margin-top: 50rpx;
		text-align: center;
		vertical-align: middle;
		touch-action: manipulation;
		cursor: pointer;
		background-image: none;
		white-space: nowrap;
		user-select: none;
		font-size: 14px;
		border: 0 !important;
		position: relative;
		text-decoration: none;
		color: #fff;
		display: block;
		border-radius: 40rpx;
		width: 400rpx;
	}

	.btn:active {
		background: #cccccc;
	}
</style>
