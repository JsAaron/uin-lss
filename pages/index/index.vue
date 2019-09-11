<template>
	<view class="home">
		<!-- 广告 -->
		<view v-if="hasAdvert" class="advert">
			<swiper indicator-dots="true" autoplay="true" interval="2000" duration="1000">
				<block v-for="(item, index) in advertImgUrls" :key="index">
					<swiper-item><image mode="aspectFill" :src="item" class="advert__image" /></swiper-item>
				</block>
			</swiper>
			<view class="time" bindtap="bindSkipAdvert">
				<view class="bg" />
				<view class="content">
					<text>跳过</text>
					<text class="t">{{ advertTime }}</text>
				</view>
			</view>
		</view>

		<!-- 用户授权 -->
		<view class="user-accredit" v-if="!hasUserAccredit">
			<view class="user-accredit__header"><image class="user-accredit__image" src="/static/logo.png" /></view>
			<button
				@tap="onChangeUserAccreditButton"
				@getuserinfo="onGetUserAccredit"
				open-type="getUserInfo"
				class="user-accredit__button"
				:class="{ 'user-accredit__button--click': userAccreditStyle }"
			>
				<text>微信授权登录</text>
			</button>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import simulate from '@/common/simulate';
import { $$set, $$get } from '@/common/global';
import parseQrCode from './code';
import getDeviceData from './device';
import { accreditUserInfo, accreditUserLocation, getLocation } from './accredit.js';

export default {
	data() {
		return {
			hasAdvert: false, //默认显示广告
			hasUserAccredit: true, //默认已授权
			userAccreditStyle: '', //授权点击样式

			advertTime: 5,
			advertImgUrls: []
		};
	},
	onLoad(options) {
		//通过退出按钮切换的
		if (options && options.pageMode === 'logout') {
			this.startApp();
			return;
		}

		//解析二维码/转发等
		parseQrCode(options);

		//权限
		accreditUserInfo(
			data => {
				$$set.userInfo(data);
				//定位服务
				accreditUserLocation(() => {
					getLocation(() => {
						util.showBusy();
						this.initDeviceData(() => {
							// 固码支付
							if ($$get.share('type') === 'qrPay') {
								//util.gotoPage('/common/qr-pay/qr-pay');
							} else {
								this.enterUrl();
							}
						});
					});
				});
			},
			e => {
				//未授权
				this.hasUserAccredit = false;
			}
		);
	},
	methods: {
		/**
		 * 进入
		 */
		enterUrl() {
			//跳过广告
			let testUrl = simulate();
			if (testUrl) {
				util.gotoPage('reLaunch', testUrl);
				return;
			}

			//如果是转发进来的,直接进入
			if ($$get.share('type') === 'goods') {
				util.hideBusy();
				util.gotoPage(
					'reLaunch',
					`/common/goods/goods?agentidsp=${$$get.share('agentidsp')}&goodsid=${$$get.share('goodsid')}`
				);
				return;
			}

			//分享注册
			if ($$get.share('type') == 'register' && !this.$api.hasLogin()) {
				util.hideBusy();
				util.gotoPage('reLaunch', `/common/login/login?pageType=user`);
				return;
			}

			//广告只显示一次
			this.runAdvert();
		},

		/**
		 * 销毁定时器
		 */
		countDownDestory() {
			if (this.countDown) {
				this.countDown.destory();
				this.countDown = null;
			}
		},

		/**
		 * 登录广告
		 */
		runAdvert() {
			util.getAdvert().then(response => {
				const images = [];
				response.data.list.map(item => {
					if (Math.random() * 10 > 5) {
						images.push(`${item.advUrl}${item.advImg}`);
					} else {
						images.unshift(`${item.advUrl}${item.advImg}`);
					}
				});
				if (images.length) {
					util.hideBusy();
					this.hasAdvert = true;
					this.advertImgUrls = images;
					this.countDown = new util.CountDown({
						checkTime: 5
					});
					this.countDown.$$watch('init', newTime => {
						this.advertTime = 5;
					});
					this.countDown.$$watch('change', newTime => {
						this.advertTime = newTime;
					});
					this.countDown.$$watch('end', defaultTime => {
						this.countDownDestory();
						this.startApp();
					});
					this.countDown.start();
				}
			});
		},

		/**
		 * 进入
		 */
		startApp() {
			util.hideBusy();
			this.hasAdvert = false;
			util.gotoPage('reLaunch', '/pages/tabbar/home/home');
		},

		//==========================================

		/**
		 * 初始化设备数据
		 */
		initDeviceData(callback) {
			getDeviceData().then(() => {
				util
					.accessLogin()
					.then(callback)
					.catch(callback);
			});
		},

		/**
		 * 获取用户授权数据
		 */
		onGetUserAccredit() {
			util
				.getUserInfo()
				.then(data => {
					$$set.userInfo(data);
					this.hasUserAccredit = true;
					this.nextProcess();
				})
				.catch(() => {
					this.userAccreditStyle = false;
					util.showModal({
						title: '温馨提示',
						showCancel: false,
						confirmText: '继续授权',
						content: '亲！拒绝将无法进入哦！您确定这么做吗'
					});
				});
		},

		/**
		 * 开始页面操作
		 */
		nextProcess() {
			accreditUserLocation(() => {
				getLocation(() => {
					this.initDeviceData(() => {
						let testUrl = simulate();
						if (testUrl) {
							util.gotoPage('reLaunch', testUrl);
							return;
						}
						this.runAdvert();
					});
				});
			});
		},

		/**
		 * 如果点击了授权
		 */
		onChangeUserAccreditButton() {
			this.userAccreditStyle = true;
		}
	}
};
</script>

<style lang="scss">
.advert {
	position: relative;
	swiper {
		width: 100vw;
		height: 100vh;
	}

	&__image {
		width: 100%;
		height: 100%;
	}
}

.user-accredit {
	position: absolute;
	z-index: 555;
	background: $background-color-white;
	width: 100%;
	height: 100%;

	&__header {
		@include flex-v;
		width: 250rpx;
		height: 250rpx;
		color: #ffffff;
		margin: 200rpx auto;
	}

	&__image {
		width: 260rpx;
		height: 260rpx;
	}

	&__title {
		font-size: 40rpx;
		font-weight: bold;
	}

	&__sub-title {
		font-size: 23rpx;
	}

	&__button {
		color: #ffffff;
		background: #29cc44;
		margin: 0 auto;
		width: 650rpx;
		font-size: 35rpx;
		font-weight: bold;

		&--click {
			background: $background-color-gray-dark;
		}
	}
}
</style>
