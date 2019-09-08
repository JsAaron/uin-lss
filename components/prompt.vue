<template>
	<!-- 忙碌 -->
	<view class="more-prompt">
		<image class="more-prompt__image" src="/static/components/iconfont-empty.png" />
		<view class="more-prompt__text">空空如也</view>
		<view>暂时没有相关数据</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	components: {},
	data() {
		return {
			closeMore: false,
			loadmoreText: '正在加载更多...',
			nomoreText: '数据全部加载完成'
		};
	},
	props: {},
	created() {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.more-prompt {
	@include position-center;
	position: fixed;
	margin-top: 0;
	text-align: center;

	&__image {
		width: 128rpx;
		height: 128rpx;
	}

	&__text {
		font-size: 32rpx;
		font-weight: 700;
		color: #333;
		margin: 4rpx 0;
	}
}
</style>
