<template>
	<view class="home">
		<!-- 商圈 -->
		<view v-if="businessDisplay" class="business-area" catchtouchmove="true" @tap="onCloseBusiness">
			<view class="business-area__wapper {businessZoom}">
				<view class="business-area__title"><text>附近商圈</text></view>
			</view>
		</view>
		<!-- 定位 -->
		<view class="area" @tap="onOpenBusiness">
			<image class="area__map" src="/static/tabbar/home/map.png" />
			<view class="area__city">
				<text>{{ biz_name }}</text>
			</view>
		</view>
		<!-- 头部 -->
		<view class="header" @tap="onSearch">
			<view class="header__left">
				<image class="header__avatar" :src="avatarUrl" />
			</view>
			<view class="header__rigth">
				<view class="header__search">
					<text class="header__search-text">搜{{biz_name}}看当地吃喝玩乐</text>
				</view>
			</view>
		</view>
		<!-- 导航 -->
		<view class="nav">
			<view class="nav__row">
				<block v-for="(item, index) in busslistData" :key="index">
					<view class="nav__col" :data-id="item.businessid" @tap="onSwitchType">
						<image class="nav__logo" :src="imgDomain + item.imgpath" />
						<text class="nav__text" :class="[item.businessid==businessid?'nav__text--active':'']">{{item.businessname}}</text>
						<view class="nav__line" :class="[item.businessid==businessid?'nav__line--active':'']" />
					</view>
				</block>
			</view>
		</view>
		<!-- 特价 -->
		<block v-if="goodslistData.length">
			<view class="discount">
				<view class="discount__header">
					<text class="discount__header-title">劲爆商品</text>
					<view class="discount__header-right">
						<text class="discount__header-more lss-color-active--blue" @tap="onDiscountMore">更多</text>
					</view>
				</view>
				<view class="discount__content">
					<block v-for="(item,index) in goodslistData" :key="index">
						<view class="discount__col" :data-index="index" @tap="onGoods">
							<image class="discount__image" top :src="imgDomain + item.goodsimg" />
							<view class="discount__row">
								<text class="discount__title">{{item.goodsname}}</text>
							</view>
							<view class="discount__row">
								<text class="discount__text-price">￥{{item.goodsprice}}</text>
								<text class="discount__cost">￥{{item.originalprice}}</text>
							</view>
							<view class="discount__row">
								<view class="discount__left">
									<view class="discount__text-site">{{item.compaddress}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</block>
		<!-- 商店 -->
		<view class="shop">
			<view class="shop__list">
				<block v-for="(item,index) in listData" :key="index">
					<view class="shop__row">
						<view v-if="index==0" class="discount__header shop__solt">
							<text class="discount__header-title">优惠商家</text>
							<view class="discount__header-right">
								<text class="discount__header-more lss-color-active--blue" @tap="onShopMore">更多</text>
							</view>
						</view>
						<view class="shop__header" :data-id="item.agentid" @tap="onDetails">
							<text class="shop__title">{{item.agentname}}</text>
							<view class="shop__header-right">
								<view>{{item.distancecd}}km</view>
							</view>
						</view>
						<view class="shop__article" :data-id="item.agentid" @tap="onDetails">
							<block v-for="(col,index) in item.goods_list" :key="index">
								<view class="shop__col">
									<view class="shop__image-box">
										<image class="shop__image" lazy-load="true" :src="imgDomain + col.goodsimg" />
										<view class="shop__price">￥{{col.goodsprice}}</view>
									</view>
									<view class="shop__goodsname lss-ellipsis--text">{{col.goodsname}}</view>
								</view>
							</block>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>
<script>
	import * as util from '@/utils';
	import {
		$$set,
		$$get
	} from '@/common/global';

	export default {
		data() {
			return {
				avatarUrl: '',
				biz_id: '',
				biz_name: '',

				imgDomain: '',

				// 商圈数据
				businessDisplay: false,
				businessZoom: '',
				businessListData: [], //商圈数据
				businessid: '', //商圈类型

				// 推荐
				listData: [], //列表数据
				listTotalPage: 0, //列表页面数
				listCurrentPage: 0, //列表当前页面获取的数量

				goodslistData: [], //商品
				busslistData: [], //分类列表
				agentlistData: [] //附近商家
			};
		},
		onLoad() {
			this.imgDomain = this.$api.imgDomain;
			this.avatarUrl = $$get.avatarUrl();
			util.getLocationData().then(res => {
				$$set.location(res.latitude, res.longitude);
				this.initData();
			}).catch(() => {
				this.initData();
			});
		},
		methods: {

			initData() {
				this.getBusinessData().then(() => {
					this.getAllData();
					//获取商家数据
					this.getShopData({
						businessid: ''
					});
				});
			},

			/**
			 * 切换类型
			 */
			onSwitchType(e) {
				let businessid = e.currentTarget.dataset.id
				this.businessid = businessid
				this.getAllData(businessid)
				this.getShopData({ businessid })
			},

			/**
			 * 获取商家数据
			 */
			getShopData({
				isPull,
				refresh,
				businessid,
				agentname
			} = {}) {
				return new Promise((resolve, reject) => {
					!refresh && !isPull && this.$api.showBusy();
					let data = {
						agentid: $$get.agentid() || '111', //没有登陆传111
						latitude: $$get.location('latitude'),
						longitude: $$get.location('longitude')
					};
					let request = {
						businessid: businessid,
						agentname: agentname,
						pageno: ++this.listCurrentPage,
						pagesize: 10,
						biz_id: this.biz_id
					};
					util.md5Ajax({
						funcode: '0072',
						encrypt: {
							data
						},
						request
					}).then(response => {
						if (isPull) {
							this.listData = this.listData.concat(response.data.list);
						} else {
							this.listData = response.data.list;
							this.listTotalPage = response.data.totalPage;
						}!refresh && !isPull && this.$api.hideBusy();
						resolve(response);
					}).catch(err => {
						!refresh && !isPull && this.$api.hideBusy();
						reject();
					});
				});
			},

			/**
			 * 获取所有数据
			 * businessid 类型
			 */
			getAllData(businessid, refresh) {
				this.businessid = businessid;
				return new Promise((resolve, reject) => {
					!refresh && this.$api.showBusy();
					let data = {
						agentid: $$get.agentid() || '111', //没有登陆传111
						latitude: $$get.location('latitude'),
						longitude: $$get.location('longitude')
					};
					let request = {
						businessid: businessid,
						biz_id: this.biz_id
					};
					util.md5Ajax({
						funcode: '0181',
						encrypt: {
							data
						},
						request
					}).then(response => {
						this.agentlistData = response.data.agentlist;
						this.busslistData = response.data.busslist;
						this.goodslistData = response.data.goodslist;
						resolve();
						!refresh && this.$api.hideBusy();
					}).catch(() => {
						!refresh && this.$api.hideBusy();
						reject();
					});
				});
			},

			/**
			 * 获取商圈数据
			 */
			getBusinessData() {
				return new Promise((resolve, reject) => {
					util.unifyAjax({
						data: {
							funcode: '0133',
							latitude: $$get.location('latitude'),
							longitude: $$get.location('longitude')
						}
					}).then(response => {
						let list = response.data.list;
						let data = list[0];
						this.businessListData = list;
						this.biz_name = data.biz_name;
						this.biz_id = data.biz_id;
						$$set.login('biz_id', data.biz_id);
						resolve();
					}).catch(reject);
				});
			}
		}
	};
</script>
<style lang="scss">
	page {
		background: rgb(242, 242, 242);
	}

	.area {
		@include flex-h-align;
		background: $blue;
		padding: 20rpx 30rpx 0 30rpx;

		&__map {
			width: 15rpx;
			height: 25rpx;
		}

		&__city {
			@include flex-h-left;
			padding: 0 10rpx;
			font-size: 25rpx;
		}

		&__icon {
			margin-left: 10rpx;
			margin-top: 3rpx;
		}
	}


	.header {
		@include flex-h-between;
		padding: 20rpx 30rpx;
		background: $blue;
		width: calc("100% - 60rpx");

		&__left {
			@include flex-h-left;
		}

		&__avatar {
			width: 58rpx;
			height: 58rpx;
			border-radius: 50%;
		}

		&__right {
			@include flex-h-left;
		}

		&__search {
			@include flex-h-left;
			background: $white;
			border-radius: 30rpx;
			padding: 5rpx 50rpx;
			width: 500rpx;
		}

		&__search-text {
			font-size: 25rpx;
			color: $text-color-gray;
		}

		&__search-icon {
			width: 40rpx;
			margin-top: 7rpx;
		}
	}

	.nav {

		&__row {
			@include flex-h-around;
			background: $white;
		}

		&__col {
			@include flex-v padding: 20rpx 0 10rpx 0;

			&:active {
				color: $blue;
			}
		}

		&__logo {
			width: 80rpx;
			height: 80rpx;
		}

		&__text {
			font-size: 28rpx;
			margin-top: 5rpx;

			&--active {
				color: $blue;
			}
		}

		&__placeholder {
			height: 20rpx;
		}

		&__line {
			width: 100%;
			height: 5rpx;
			margin-top: 10rpx;

			&--active {
				background: $blue;
			}
		}
	}

	.discount {
		width: 100%;
		background: $white;
		margin: 20rpx 0;
		padding-bottom: 30rpx;

		&__header {
			@include flex-h-between;
			padding: 20rpx 30rpx;
		}

		&__header-title {
			font-size: 35rpx;
		}

		&__header-more {
			font-size: 28rpx;
			color: $text-color-gray;
		}

		&__header-right {
			@include flex-h-left;
		}

		&__content {
			display: flex;
			flex-flow: wrap;
		}

		&__row {
			@include flex-h;
			padding: 10rpx 30rpx 0 30rpx;
			position: relative;
		}

		&__col {
			width: 50%;
		}

		&__image {
			width: 340rpx;
			height: 272rpx;
			border-radius: 10rpx;
			// background: #ccc;
			display: block;
			margin: 0 auto;
		}

		&__left {
			@include flex-h-between;
		}

		&__title {
			font-size: 26rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}


		&__text-site {
			color: $text-color-gray;
			font-size: 22rpx;
			max-width: 300rpx;
		}

		&__price {
			width: 75rpx;
			height: 48rpx;
			position: absolute;
			right: 20rpx;
		}

		&__image-price {
			width: 100%;
			height: 100%;
		}

		&__cost {
			font-size: 22rpx;
			text-decoration: line-through;
			color: $text-color-gray;
			margin: 2rpx 0 0 5rpx
		}

		&__text-price {
			font-size: 26rpx;
			color: $red;
			font-weight: bold;
		}

	}

	.shop {
		width: 700rpx;
		margin: 0 auto;
		border-radius: 10rpx;

		&__solt {
			padding: 10rpx 20rpx;
		}

		&__row {
			background: $white;
			border-radius: 10rpx;
			padding: 20rpx;
			margin-bottom: 10rpx;
		}

		&__header {
			@include flex-h-between;
			padding: 10rpx 20rpx;
		}

		&__title {
			font-size: 30rpx;
			color: #1a1a1a;
			font-weight: 600;
		}

		&__header-right {
			@include flex-h-left;
			font-size: 26rpx;
			color: $text-color-gray;
		}

		&__goodsname {
			width: 200rpx;
		}

		&__map {
			width: 26rpx;
			height: 26rpx;
			margin-right: 10rpx;

			&--small {
				transform: scale(0.8);
				margin-right: 5rpx
			}
		}

		&__col {
			text-align: center;
			font-size: 25rpx;
			font-weight: 600;
		}

		&__article {
			@include flex-h-around;
			padding: 20 0;
			color: #1a1a1a;
		}


		&__image-box {
			position: relative;
		}

		&__image {
			width: 200rpx;
			height: 160rpx;
			border-radius: 10rpx;
			background: #ccc;
		}

		&__price {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			font-size: 28rpx;
			text-align: center;
			background-color: rgba(0, 0, 0, 0.3);
			color: $white;
		}

	}


	/* 商圈 */
	.business-area {
		width: 100vw;
		height: 100vh;
		position: absolute;
		z-index: 22;
		background-color: rgba(0, 0, 0, 0.5);

		&__wapper {
			@include position-center;
			z-index: 999;
			width: 580rpx;
			height: 720rpx;
			background: $white;
			border-radius: 10rpx;
		}

		&__title {
			@include flex-h-left;
			height: 100rpx;
			margin-left: 20rpx;
		}

		&__view {
			@include flex-h-between;
			font-size: 25rpx;
		}

		&__text {
			display: block;
			padding: 25rpx 20rpx;
			font-size: 26rpx;
		}

		&__text_right {
			font-size: 20rpx;
			color: $gray-dark;
		}
	}

	@-webkit-keyframes zoomIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.zoomIn {
		-webkit-animation-name: zoomIn;
		-webkit-animation-timing-function: ease-in-out;
		-webkit-animation-iteration-count: 1;
		-webkit-animation-duration: 500ms;
		-webkit-animation-fill-mode: forwards;
	}
</style>
