<template>
	<view>
		<!-- 顶部 -->
		<view class="banner">
			<view class="banner__left">
				<image class="banner__logo" :src="avatarUrl" />
				<view>
					<view class="banner__t">
						<text>{{ nickName }}</text>
						<text v-if="isfact" class="banner__shimimg">已认证</text>
						<text v-else class="banner__shimimg" bindtap="gotoPage" data-url="/pages/user/pages/my/certification/certification">{{ hasLogin ? '未实名' : '未登录' }}</text>
					</view>
					<view class="banner__t banner__t2">
						<text>{{ mobileno }}</text>
					</view>
				</view>
			</view>
			<view class="banner__right" bindtap="bindGotoMerchant">
				<image class="banner__m" :src="getLevel" />
				<view>金牌创客</view>
			</view>
		</view>

		<!-- 统计 -->
		<view class="statistics">
			<view class="statistics__row">
				<view class="statistics__col">
					<text class="statistics__m">100元</text>
					<text class="statistics__t">可提现</text>
				</view>
				<view class="statistics__col">
					<text class="statistics__m">100元</text>
					<text class="statistics__t">总收入</text>
				</view>
				<view class="statistics__arrow">
					<text class="statistics__t">收支明细</text>
					<uni-icon type="arrow" class="statistics__arrow-icon" size="16"></uni-icon>
				</view>
			</view>
			<view class="statistics__button">
				<waves-button btnStyle="background:linear-gradient(to right,#FF9A29, #FF6B0E);height:65rpx;border-radius:10px" wavesColor="rgba(255,101,16,.6)" txt="提现"></waves-button>
			</view>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import uniIcon from '@/components/uni-icon/uni-icon';
import wavesButton from '@/components/waves-button/waves-button';
export default {
	components: {
		uniIcon,
		wavesButton
	},
	data() {
		return {
			avatarUrl: '',
			nickName: '',
			hasLogin: '',
			user_level_name: '',
			mobileno: ''
		};
	},
	onShow() {
		this.mobileno = util.phoneEncrypt($$get.login('mobileno'));
		this.hasLogin = this.$api.hasLogin();
		this.user_level_name = $$get.login('user_level_name');
		this.isfact = $$get.login('isfact');
		this.nickName = $$get.userInfo('nickName');
		this.avatarUrl = $$get.userInfo('avatarUrl');
		// this.getInitData();
	},
	props: {},
	created() {},
	onLoad() {},
	computed: {
		getLevel() {
			let level = 2 || $$get.login('user_level');
			return `/static/tabbar/center/${level}.png`;
		}
	},
	methods: {}
};
</script>

<style lang="scss">
.banner {
	@include flex-h-between(flex-start);
	width: 100vw;
	z-index: 1;
	height: 200rpx;
	background-image: url('~@/static/tabbar/center/banner.png');
	background-size: 100% 100%;
	color: $text-color-white;
	&__left {
		height: 150rpx;
		@include flex-h-left;
	}

	&__logo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #ffffff;
		margin: 0 30rpx;
	}

	&__vip {
		width: 90rpx;
		height: 25rpx;
	}

	&__vip-text {
		font-size: 25rpx;
		color: $text-color-gray;
	}

	&__m {
		width: 48rpx;
		height: 48rpx;
	}

	&__right {
		@include flex-v;
		margin-right: 30rpx;
		text-align: center;
		font-size: 26rpx;
		height: 150rpx;
	}

	&__t {
		@include flex-h-left;
	}

	&__t2 {
		font-size: 30rpx;
		margin-top: 20rpx;
	}

	&__shimimg {
		margin-left: 10rpx;
		font-weight: bold;
		font-size: 22rpx;
		border: 1px solid $gray;
		background: #fff;
		border-radius: 30rpx;
		color: $text-color-gray;
		padding: 5rpx 15rpx;

		&:active {
			background: $gray;
		}
	}
}

//统计
.statistics {
	width: 690rpx;
	position: relative;
	padding: 30rpx 0;
	left: 30rpx;
	z-index: 1;
	top: -60rpx;
	background: $background-color-white;
	border-radius: 10rpx;
	&__row {
		@include flex-h-around;
	}
	&__col {
		@include flex-v;
	}
	&__arrow{
		@include flex-h;
	}
	&__arrow-icon{
		height: 30rpx;
	}
	&__button {
		width: 480rpx;
		margin: 0 auto;
		padding-top: 30rpx;
	}
	&__m {
		color: $text-color-orange;
		font-weight: bold;
	}
	&__t{
		font-size: 26rpx;
	}
}
</style>
