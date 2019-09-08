<template>
	<view>
		<!-- 加载更多 -->
		<view v-if="showLoadMore" class="load-more">
			<view class="load-more__view">
				<image
					v-if="!nomore"
					class="load-more__roate load-more__image"
					src="/static/components/lss-load-more/loading.png"
				/>
			</view>

			<view class="load-more__view">
				<!-- 完成 -->
				<block v-if="nomore">
					<image
						class="load-more__image load-more__image-finish"
						src="/static/components/lss-load-more/finish.png"
					/>
					<text class="load-more__text">{{ nomoreText }}</text>
				</block>
				<!-- 加载 -->
				<text v-else class="load-more__text">{{ loadmoreText }}</text>
			</view>
			<view />
		</view>

		<!-- 如果没有数据 -->
		<prompt v-if="!hasData" />
	</view>
</template>

<script>
import prompt from '@/components/prompt';
export default {
	components: {
		prompt
	},
	props: {
		/**
		 * 页码总数
		 */
		total: {
			type: Number,
			default: 0
		},
		/**
		 * 数据上拉加载完毕
		 * 没有更多的数据
		 * 修改状态
		 */
		nomore: {
			type: Boolean,
			default: false
		},
		/**
		 * 提示文本
		 */
		contentText: {
			type: Object,
			default() {
				return {
					contentdown: '上拉显示更多',
					contentrefresh: '数据加载中...',
					contentnomore: '没有更多数据了'
				};
			}
		}
	},
	data() {
		return {
			hasData: true, //是否有数据
			showLoadMore: false, //默认不出现
			closeMore: false,
			loadmoreText: '数据加载中...',
			nomoreText: '没有更多了'
		};
	},

	watch: {
		total(val) {
			//没有数据
			if (val == 0) {
				this.hasData = false;
				this.showLoadMore = false;
				return;
			}

			//如果val与1 关闭加载更多
			if (val == 1) {
				this.hasData = true;
				this.showLoadMore = true;
				this.nomore = true;
				return;
			}

			//有多页数据
			this.hasData = true;
			this.showLoadMore = true;
			this.nomore = false;
		}
	}
};
</script>

<style lang="scss">
.load-more {
	@include flex-h;
	padding: 10rpx 0;
	font-size: 22rpx;
	background: $white;
	color: #7d7e80;

	// margin: 10rpx 0;
	&__view {
		@include flex-h;
		height: 48rpx;
	}

	&__image {
		width: 32rpx;
		height: 32rpx;
	}

	&__image-finish {
		margin-right: 10rpx;
	}

	&__roate {
		margin-right: 10rpx;
		-moz-animation: rotate 1s infinite linear;
		-webkit-animation: rotate 1s infinite linear;
		animation: rotate 1s infinite linear;
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
