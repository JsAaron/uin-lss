<template>
	<view class="home">
		<!-- 广告 -->
		<view v-if="!hasAdvert" class="advert">1</view>

		<!-- 用户授权 -->
		<view class="user-accredit" v-if="!hasUserAccredit">
			<view class="user-accredit__header">
				<image class="user-accredit__image" src="/static/logo.png" />
			</view>
			<button @tap="onChangeUserAccreditButton" @getuserinfo="onGetUserAccredit" open-type="getUserInfo" class="user-accredit__button"
			 :class="{ 'user-accredit__button--click': userAccreditStyle }">
				<text>微信授权登录</text>
			</button>
		</view>
	</view>
</template>

<script>
	import * as util from '@/utils';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';

	const app = getApp();

	/**
	 * 检测用户权限，设置数据
	 * 获取微信用户基本信息
	 */
	function accreditUserInfo(success, fail) {
		util
			.checkAccredit('scope.userInfo')
			.then(() => {
				util.getUserInfo().then(data => {
					success(data);
				});
			})
			.catch(fail);
	}

	/**
	 * 检测用户定位
	 */
	function accreditUserLocation(success, fail) {
		util.detectAccredit('scope.userLocation').then(success).catch(() => {
			let data = {
				content: '您未选择地理位置，我们无法为您提供服务！',
				scope: 'scope.userLocation',
				buttonText: '重新获取地理位置',
				describe: '亲，我们未获得您的位置授权，将无法为您提供推荐的商圈以及相关的一些活动！'
			};
			util.gotoPage(`/pages/common/accredit/accredit?data=${JSON.stringify(data)}`);
			fail && fail();
		});
	}

	/**
	 * 获取坐标位置
	 */
	function getLocation(callback) {
		util.getLocationData().then(res => {
			app.globalData.location.latitude = res.latitude;
			app.globalData.location.longitude = res.longitude;
			callback && callback()
		})
	}

	export default {
		computed: {
			...mapGetters(['appid', 'code'])
		},
		data() {
			return {
				hasAdvert: true, //默认显示广告
				hasUserAccredit: true, //默认已授权
				userAccreditStyle: '' //授权点击样式
			};
		},
		onLoad(options) {
			//权限
			accreditUserInfo(
				data => {
					// this.
					this.SET_USERINFO(data)

					//定位服务
					accreditUserLocation(() => {
						getLocation(() => {
							this.$api.showBusy()
							this.initDeviceData(() => {
								// 		// // 固码支付
								// 		// if (app.globalData.share.type === "qrPay") {
								// 		// 	this.$api.gotoPage("/common/qr-pay/qr-pay")
								// 		// } else {
								// 		// 	this.enterUrl()
								// 		// }
							});
						})
					})
				},
				e => {
					//未授权
					this.hasUserAccredit = false;
				}
			);
		},
		methods: {
			...mapMutations(['SET_USERINFO', 'SET_CODE', 'SET_OPENID']),
			/**
			 * 初始化设备数据
			 */
			initDeviceData(callback) {
				this.getDeviceData().then(() => {
					// console.log(app)
					// app.$$accessLoginData().then(callback).catch(callback)
				})
			},

			//====================
			// 自动
			//====================

			/**
			 * 获取硬件登录参数
			 */
			getDeviceData() {
				return new Promise((reslove, reject) => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							if (!loginRes.code) {
								this.$api.showToast('登录失败！' + loginRes.errMsg)
								return reject()
							}
							//获取code
							this.SET_CODE(loginRes.code)
							util.getWxOpenId({
								appid: this.appid,
								code: loginRes.code
							}).then(openRes => {
								//获取openid
								const openid = openRes.data.openid;
								if (openid) {
									this.SET_OPENID(openid)
									reslove();
								} else {
									this.$api.showToast("没有获取设备编号,请再次点击");
									return;
								}
							}).catch(err => {
								this.$api.showToast('服务器连接失败')
								reject();
							});
						},
						fail() {
							this.$api.showToast(' 获取微信登录凭证失败')
							reject();
						}
					});
				});
			},

			/**
			 * 开始页面操作
			 */
			nextProcess() {

			},

			/**
			 * 获取用户授权数据
			 */
			onGetUserAccredit() {
				util
					.getUserInfo()
					.then(userInfo => {
						this.SET_USERINFO(userInfo)
						this.hasUserAccredit = true;
						this.nextProcess();
					})
					.catch(() => {
						this.userAccreditStyle = false;
						this.$api.showModal({
							title: '温馨提示',
							showCancel: false,
							confirmText: '继续授权',
							content: '亲！拒绝将无法进入哦！您确定这么做吗'
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
