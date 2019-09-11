<template>
	<view class="pop-box" :class="[animateClass]">
		<view class="title lss-hairline--top">
			<text>上传正面照</text>
			 <uni-icon type="cross" class="close" size="18">关闭</uni-icon>
		</view>
		<view class="content">
			<camera device-position="back" flash="auto" @error="error" style="width: 100%; height: 500upx;">
				<cover-image :src="image?image:bg" class="scan-img"></cover-image>
			</camera>
		</view>
		<button type="primary" style="position: absolute;bottom: 50rpx;width: 80%;left:10%;" @click="takePhoto">
			拍照
		</button>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import uniIcon from '@/components/uni-icon/uni-icon';
export default {
	components: {
		uniIcon
	},
	data() {
		return {
			animateClass: 'slideInUp',
			bg:'/static/components/scan-frame/scan-img.png',
			
			image:'',
			succeed: false,
			stauts: false //false 关闭  true 打开
		};
	},
	methods: {
		takePhoto() {
			const ctx = uni.createCameraContext();
			ctx.takePhoto({
				quality: 'high',
				success: res => {
					this.image = res.tempImagePath;
				}
			});
		},
		error(e) {
			console.log(e.detail);
		}
	}
};
</script>

<style lang="scss">
.pop-box {
	position: fixed;
	width: 100%;
	height: 800rpx;
	bottom: 0;
	background: #ffffff;
	z-index: 999999;
	-webkit-transform: translate3d(0, 100%, 0);
}

.close{
	position:absolute;
	right: 30rpx;
	top:30rpx;
}

.pop-box .title {
	position: relative;
	display: block;
	width: 100%;
	text-align: center;
	height: 100rpx;
	line-height:100rpx;
	border-bottom: 1px solid rgb(217, 217, 217);
	font-size: 30rpx;
}

.pop-box .title > image {
	width: 25rpx;
	height: 25rpx;
	position: absolute;
	right: 40rpx;
	top: 50%;
	transform: translateY(-50%);
}

@keyframes slideInUp {
	from {
		-webkit-transform: translate3d(0, 100%, 0);
		transform: translate3d(0, 100%, 0);
		visibility: visible;
	}
	to {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}
}

.slideInUp {
	-webkit-animation-name: slideInUp;
	-webkit-animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: 1;
	-webkit-animation-duration: 300ms;
	-webkit-animation-fill-mode: forwards;
}


.scan-img {
	opacity: 0.4;
	width: 100%;
	height: 500rpx;
}
.scan-text {
	font-size: 20px;
	text-align: center;
	line-height: 60rpx;
}
</style>
