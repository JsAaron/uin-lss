<template>
	<view v-if="listData">
		<view class="goods__content" :class="filter">
			<image class="logo" :src="imgDomain + listData.goodsimg" />
			<view class="row price">
				<view class="row__left">￥{{ listData.goodsprice }}</view>
				<view class="row__right" @tap="onShareFriend">
					<image class="row__share" src="/static/components/product/3.png" />
					<text class="row__share-text">分享</text>
				</view>
			</view>
			<view class="row title lss-hairline--bottom">{{ listData.goodsname }}</view>
			<view class="row note">{{ listData.goodsnote }}</view>
			<block v-if="listData.detailsimgs">
				<image
					class="shop"
					v-for="(item, index) in listData.detailsimgs"
					:key="index"
					:src="getUrl(item)"
				/>
			</block>
		</view>
		<view v-if="hasGoods" class="home" bindtap="onToHome">返回</view>
		<share
			v-if="showShare"
			:shareData="shareData"
			@close="onCloseShareFriend"
			@beforeClose="onBeforeClose"
		/>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import share from './share';
export default {
	components: { share },
	data() {
		return {
			filter: '',
			imgDomain: '',
			hasGoods: false,
			listData: [],
			showShare: false,
			shareData: {}
		};
	},
	props: {},
	created() {
		this.imgDomain = this.$api.imgDomain;
	},
	onLoad(options) {
		//如果是通过分享注册，有agentidsp
		if (options.agentidsp && options.goodsid) {
			this.getDetailsData(options.agentidsp, options.goodsid).then(res => {
				this.initData(res.data.list[0]);
			});
		} else {
			//如果通过options.data
			if (!options.data) {
				options.data =
					'{"id":226,"agentid":"708000722194","total_num":0,"originalprice":"15","goodsprice":"13","agentname":"汉虾王","goodsname":"娄源隆","goodsimg":"/agentimg/2c235fd1-52a4-44f9-a211-95e2274d9cd0.jpg","goodsnote":"鹿茸补精、益气安神、补益脾胃","user_num":0,"latitude":"22.56644","longitude":"113.90603","compaddress":"南宁市金凯路38-1号金凯便民综合街第F22号铺面","type":"0","agentlogo":"/agentimg/b2e54948-3c2e-4786-ac36-3afefff78933.jpg","detailsimg":"12d765a7-b2fa-424f-8b69-fe0cff6aea7f.jpg,29391a7c-ad1d-49a7-a0df-a5d697751b5b.jpg,2c7a9bc0-79e6-47fe-b6c3-c403a44b8ae6.jpg,b70114c3-4b9a-4a97-83d4-dd2553d1fb9a.jpg"}';
			}
			let data = JSON.parse(options.data);
			this.initData(data);
		}
	},
	methods: {
		/**
		 * 加密
		 * @param value
		 * pos 加密位置，头部或者尾部 front end
		 */
		getUrl(item) {
			// agentimg/4764b9e5-4761-4ae5-a095-1552a84ea16b.jpg
			// 没有前缀
			if (item.indexOf('agentimg') == -1) {
				item = '/agentimg/' + item;
			}
			return this.imgDomain + item;
		},

		/**
		 * 数据处理
		 */
		initData(data) {
			if (data.detailsimg) {
				data.detailsimgs = data.detailsimg.split(',');
			}
			this.hasGoods = $$get.share('type') === 'goods';
			this.listData = data;
		},

		/**
		 * 分享好友
		 */
		onShareFriend() {
			if (this.listData) {
				let data = this.listData;
				this.filter = 'filter--in';
				this.showShare = true;
				this.shareData = {
					agentidsp: data.agentid,
					goodsid: data.id,
					goodsImage: this.imgDomain + data.goodsimg,
					contentTitle: data.goodsname,
					price: data.goodsprice,
					delPrice: data.originalprice,
					nickName: $$get.userInfo('nickName')
				};
			}
		},
		/**
		 * 关闭之前处理玻璃
		 */
		onBeforeClose() {
			this.filter = 'filter--out';
		},

		/**
		 * 关闭分享
		 */
		onCloseShareFriend() {
			this.showShare = false
		}
	}
};
</script>

<style lang="scss">
page {
	background: $white;
}

.home {
	position: fixed;
	z-index: 1500;
	right: 30rpx;
	bottom: 30rpx;

	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background-color: #4f96ff;
	font-size: 30rpx;
	color: #fff;
	line-height: 100rpx;
	text-align: center;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.14), 0 8rpx 16rpx rgba(0, 0, 0, 0.28);
}

.button {
	@include flex-h-around;
	position: fixed;
	bottom: 100rpx;
	z-index: 222222;
	transform: translateX(-50%);
	left: 50%;
	width: 100%;

	&__rol {
		background: $white;
		text-align: center;
		padding: 20rpx 30rpx;
		margin: 0 auto;
		border-radius: 7rpx;
		font-size: 35rpx;

		&:active {
			background: $gray-light;
		}
	}
}

.goods {
	left: 15%;
	top: -100%;
	position: fixed;
	z-index: 11111;
}

.logo {
	width: 750rpx;
	height: 600rpx;
}

.shop {
	width: 680rpx;
	height: 540rpx;
	border-radius: 10rpx;
	margin: 20rpx auto;
	display: block;
}

.row {
	padding: 0 30rpx;

	&__right {
		@include flex-v;
	}

	&__share {
		width: 40rpx;
		height: 40rpx;
	}

	&__share-text {
		font-size: 22rpx;
	}

	&__left {
		color: #f50000;
		font-size: 45rpx;
		font-weight: bold;
	}
}

.price {
	@include flex-h-between;
	padding: 20rpx 60rpx 20rpx 20rpx;
}

.title {
	font-size: 28rpx;
	padding-bottom: 30rpx;
}

.share {
	width: 130rpx;
	height: 45rpx;
}

.note {
	font-size: 28rpx;
	padding: 30rpx;
}

@keyframes filterIn {
	from {
		filter: blur(0);
	}

	to {
		filter: blur(6px);
	}
}

.filter--in {
	animation-name: filterIn;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}

@keyframes filterOut {
	from {
		filter: blur(6px);
	}

	to {
		filter: blur(0px);
	}
}

.filter--out {
	animation-name: filterOut;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}
</style>
