<template>
	<view class="home">
		<!-- 商圈 -->
		<view v-if="businessDisplay" class="business-area" catchtouchmove="true" @tap="onCloseBusiness">
			<view class="business-area__wapper {businessZoom}">
				<view class="business-area__title"><text>附近商圈</text></view>
				<lss-scroll-view scrollHeight="{scrollHeight}">
					<view
						class="business-area__view lss-hairline--bottom lss-background-active--gray"
						v-for="(item, index) in businessListData"
						:key="index"
						:data-index="index"
						bindtap="onSwitchBusiness"
					>
						<text class="business-area__text t1">{{ item.biz_name }}</text>
						<text class="business-area__text business-area__text_right">距离你{{ item.aa }}米</text>
					</view>
				</lss-scroll-view>
			</view>
		</view>
		
		<!-- 定位 -->
		<view class="area" bindtap="onOpenBusiness">
			<image class="area__map" src="/static/tabbar/home/map.png" />
			<view class="area__city">
				<text>{{ biz_name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	data() {
		return {
			avatarUrl: '',
			biz_id: '',
			biz_name:'',

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
		this.avatarUrl = $$get.avatarUrl();
		util
			.getLocationData()
			.then(res => {
				$$set.location(res.latitude, res.longitude);
				this.initData();
			})
			.catch(() => {
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
		 * 获取商家数据
		 */
		getShopData({ isPull, refresh, businessid, agentname } = {}) {
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
				util
					.md5Ajax({
						funcode: '0072',
						encrypt: { data },
						request
					})
					.then(response => {
						if (isPull) {
							this.listData = this.listData.concat(response.data.list);
						} else {
							this.listData = response.data.list;
							this.listTotalPage = response.data.totalPage;
						}
						!refresh && !isPull && this.$api.hideBusy();
						resolve(response);
					})
					.catch(err => {
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
				util
					.md5Ajax({
						funcode: '0181',
						encrypt: { data },
						request
					})
					.then(response => {
						this.agentlistData = response.data.agentlist;
						this.busslistData = response.data.busslist;
						this.goodslistData = response.data.goodslist;
						resolve();
						!refresh && this.$api.hideBusy();
					})
					.catch(() => {
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
				util
					.unifyAjax({
						data: {
							funcode: '0133',
							latitude: $$get.location('latitude'),
							longitude: $$get.location('longitude')
						}
					})
					.then(response => {
						const list = response.data.list;
						const data = list[0];
						this.businessListData = list;
						this.biz_name = data.biz_name;
						this.biz_id = data.biz_id;
						$$set.login('biz_id', data.biz_id);
						resolve();
					})
					.catch(reject);
			});
		}
	}
};
</script>

<style lang="scss">
	
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
