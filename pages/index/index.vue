<template>
	<view class="home">
		<!-- 广告 -->
		<view v-if="!hasAdvert" class="advert">1</view>

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
	util
		.detectAccredit('scope.userLocation')
		.then(success)
		.catch(() => {
			let data = {
				content: '您未选择地理位置，我们无法为您提供服务！',
				scope: 'scope.userLocation',
				buttonText: '重新获取地理位置',
				describe: '亲，我们未获得您的位置授权，将无法为您提供推荐的商圈以及相关的一些活动！'
			};
			util.gotoPage(`/common/accredit/accredit?data=${JSON.stringify(data)}`);
			fail && fail();
		});
}

export default {
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
				app.globalData.userInfo = data;
				console.log(app);
			},
			e => {
				//未授权
				this.hasUserAccredit = false;
			}
		);
	},
	methods: {
		/**
		 * 开始页面操作
		 */
		nextProcess() {
			accreditUserLocation(
				() => {},
				() => {
					this.data.action = 'accredit-location';
				}
			);
		},

		/**
		 * 获取用户授权数据
		 */
		onGetUserAccredit() {
			util
				.getUserInfo()
				.then(userInfo => {
					app.globalData.userInfo = userInfo;
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
