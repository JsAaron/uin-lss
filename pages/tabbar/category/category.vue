//======== 类型导航模块 ========

<template>
	<view class="content">
		<view class="search-box">
			<mSearch class="mSearch-input-box" button="inside" :placeholder="defaultKeyword" @search="onSearchBar" @confirm="onSearchBar" v-model="keyword"></mSearch>
		</view>
		<!-- 导航 -->
		<type-nav :bid="businessid" :list-data="busslistData" @get-typeid="onGetTypeId"></type-nav>

		<!-- 内容 -->
		<view class="discount">
			<view class="discount__content">
				<block v-for="(item, index) in listData" :key="index">
					<view class="discount__col lss-hairline--bottom" :data-index="index" @tap="onShare">
						<view class="discount__image-wrapper"><image class="discount__image" mode="aspectFill" :src="imgDomain + item.goodsimg" /></view>
						<view class="discount__row">
							<text class="discount__title">{{ item.goodsname }}</text>
						</view>
						<view class="discount__row">
							<text class="discount__text-price">￥{{ item.goodsprice }}</text>
							<text class="discount__cost">￥{{ item.originalprice }}</text>
						</view>
						<view class="discount__row">
							<view v-if="item.compaddress" class="discount__left">
								<image class="discount__map discount__map--small" src="/static/tabbar/product/2.png" />
								<view class="discount__text-site">{{ item.compaddress }}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>

		<!-- 加载更多 -->
		<lss-load-more :total="listTotalPage" :nomore="nomore" />
	</view>
</template>

<script>
import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision';
import lssLoadMore from '@/components/lss/lss-load-more/lss-load-more';
import uniIcon from '@/components/uni/uni-icons/uni-icons';
import typeNav from '../../common/type-nav';
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';

export default {
	components: {
		mSearch,
		typeNav,
		uniIcon,
		lssLoadMore
	},
	data() {
		return {
			defaultKeyword: '搜索商品名',
			keyword: '',
			imgDomain: '',
			nomore: false,

			biz_id: '111', //商圈id
			busslistData: [], //分类数据
			businessid: '', //分类id

			listData: [], //列表数据
			listTotalPage: 0, //列表页面数
			listCurrentPage: 0 //列表当前页面获取的数量
		};
	},
	created() {
		this.imgDomain = this.$api.imgDomain;
	},
	onLoad() {
		this.getClassifyData().then(response => {
			this.busslistData = response.data.businesslist;
			this.businessid = '';
			this.biz_id = $$get.login('biz_id');
			this.getDiscountData();
		});
	},
	methods: {
		/**
		 * @param {Object} key
		 * 执行搜索
		 */
		onSearchBar(key) {
			if (!key) return;
			this.getDiscountData({
				busyName: '搜索中...',
				goodsname: key,
				reset: true
			});
		},

		/**
		 * @param {Object}
		 * 分享
		 */
		onShare(e) {
			const data = this.listData[e.currentTarget.dataset.index];
			util.gotoPage(`../../common/product?data=${JSON.stringify(data)}`);
		},

		/**
		 * 加载更多
		 */
		onReachBottom() {
			//全部完成
			if (this.listCurrentPage >= this.listTotalPage) {
				this.nomore = true;
				return;
			}
			//继续加载
			this.getDiscountData({
				isPull: true
			});
		},

		/**
		 * 获取分类数据
		 */
		getClassifyData() {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0018'
						}
					})
					.then(resolve)
					.catch(reject);
			});
		},

		/**
		 * @param {Object} id
		 * 获取分类id
		 */
		onGetTypeId(bid) {
			this.businessid = bid;
			this.getDiscountData({
				businessid: bid,
				reset: true
			});
		},

		/**
		 * 获取特价数据
		 */

		getDiscountData({
			goodsname = '',
			businessid = '',
			busyName = '',
			reset = false,
			isPull = false //下拉加载
		} = {}) {
			return new Promise((resolve, reject) => {
				if (reset) {
					this.listCurrentPage = 0;
				}

				let hasBusy = !isPull;
				hasBusy && this.$api.showBusy(busyName);

				let request = {
					goodsname: goodsname, //商品名
					businessid: businessid, //分类
					pageno: ++this.listCurrentPage,
					pagesize: 20
				};
				util
					.md5Ajax({
						funcode: '0182',
						encrypt: {
							data: {
								biz_id: String(this.biz_id) //商圈id
							}
						},
						request
					})
					.then(response => {
						if (isPull) {
							this.listData = this.listData.concat(response.data.goodslist);
						} else {
							this.listData = response.data.goodslist;
							this.listTotalPage = response.data.totalPage;
						}
						hasBusy && this.$api.hideBusy();
						resolve();
					})
					.catch(e => {
						hasBusy && this.$api.hideBusy();
						reject();
					});
			});
		}
	}
};
</script>

<style lang="scss">
.search-box {
	width: 95%;
	background-color: rgb(242, 242, 242);
	padding: 15upx 2.5%;
	display: flex;
	justify-content: space-between;
}

.search-box .mSearch-input-box {
	width: 100%;
}

.search-box .input-box {
	width: 85%;
	flex-shrink: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}

.search-box .search-btn {
	width: 15%;
	margin: 0 0 0 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	font-size: 28upx;
	color: #fff;
	background: linear-gradient(to right, #ff9801, #ff570a);
	border-radius: 60upx;
}

.search-box .input-box > input {
	width: 100%;
	height: 60upx;
	font-size: 32upx;
	border: 0;
	border-radius: 60upx;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	padding: 0 3%;
	margin: 0;
	background-color: #ffffff;
}

.discount {
	width: 100%;
	background: $white;

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
		padding: 20rpx 0;
	}

	&__image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		width: 340rpx;
		height: 272rpx;
		border-radius: 10rpx;
		margin: 0 auto;
	}

	&__image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		display: block;
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
		@include ellipsis;
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
		margin: 2rpx 0 0 5rpx;
	}

	&__text-price {
		font-size: 26rpx;
		color: $red;
		font-weight: bold;
	}

	&__map {
		width: 26rpx;
		height: 26rpx;
		margin-right: 10rpx;

		&--small {
			transform: scale(0.8);
			margin-right: 5rpx;
		}
	}
}
</style>
