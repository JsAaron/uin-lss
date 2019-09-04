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
				// app.globalData.userInfo = data;
			},
			e => {
				//未授权
				this.hasUserAccredit = false;
			}
		);
	},
	methods: {
		/**
		 * 获取用户授权数据
		 */
		onGetUserAccredit() {
			util
				.getUserInfo()
				.then(userInfo => {
					console.log(userInfo)
					//app.globalData.userInfo = userInfo;
				})
				.catch(() => {

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
