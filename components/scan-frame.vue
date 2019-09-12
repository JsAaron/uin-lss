<template>
	<view class="pop-box" :class="[popAnimateClass]">
		<view class="title lss-hairline--top">
			<text>{{ title }}</text>
			<uni-icon type="cross" class="close" @tap="onClose" size="18">关闭</uni-icon>
		</view>
		<view class="content">
			<camera
				v-if="showCamera"
				device-position="back"
				flash="auto"
				@error="error"
				style="width: 100%; height: 500rpx;"
			>
				<cover-image
					src="/static/components/scan-frame/scan-img.png"
					class="scan-img"
				></cover-image>
			</camera>

			<view
				v-if="scanImageSrc"
				style="width: 100%; height: 500rpx;position: relative;overflow: hidden;"
			>
				<image :src="scanImageSrc" style="width: 100%; height: 100%;"></image>
				<view class="swiper-animate"></view>
				<view class="scan-text">识别中</view>
			</view>
		</view>

		<block v-if="scanImageSrc">
			<button
				type="primary"
				style="background: #9E9E9E;position: absolute;bottom: 50rpx;width: 80%;left:10%;"
				@click="resetPhoto"
			>
				重拍
			</button>
		</block>
		<block v-else>
			<button
				type="primary"
				style="background: #4f96ff;position: absolute;bottom: 50rpx;width: 80%;left:10%;"
				@click="takePhoto"
			>
				拍照
			</button>
		</block>
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
	props: {
		dataSet: {
			type: Object,
			default() {
				return {
					title: ''
				};
			}
		}
	},
	data() {
		return {
			title: '',
			showCamera: false,
			popAnimateClass: '',
			scanImageSrc: ''
		};
	},
	watch: {
		dataSet(val, oldVal) {
			if (Object.keys(val).length) {
				this.title = val.title;
				this.popAnimateClass = 'slideInUp';
				this.showCamera = true;
			}
		}
	},
	methods: {
		takePhoto() {
			const ctx = uni.createCameraContext();
			ctx.takePhoto({
				quality: 'high',
				success: res => {
					this.scanImageSrc = res.tempImagePath;
					this.showCamera = false;
				}
			});
		},

		clean() {
			this.$emit('update:dataSet', {});
			this.scanImageSrc = '';
			this.showCamera = false;
			setTimeout(() => {
				this.popAnimateClass = 'slideInDown';
			}, 0);
		},

		onClose() {
			if (this.scanImageSrc) {
				util.showModal({
					content: '正在识别中,确定退出?',
					success: res => {
						if (res.confirm) {
							this.clean();
						}
					}
				});
				return;
			}
			this.clean();
		},
		/**
		 * 重新拍
		 */
		resetPhoto() {
			this.image = '';
		},
		error(e) {
			console.log(e.detail);
		}
	}
};
</script>

<style lang="scss">
.swiper-animate {
	position: absolute;
	width: 100%;
	height: 500rpx;
	left: 0;
	top: 0;
	z-index: 2;
	background: linear-gradient(to bottom, transparent, #3e88f1);
	animation: scan 1.5s ease-in-out infinite;
}

@keyframes scan {
	from {
		top: -500rpx;
	} /*网格移动到显示区域的外面*/
	to {
		top: 0;
	}
}

.pop-box {
	position: fixed;
	width: 100%;
	height: 800rpx;
	bottom: 0;
	background: #ffffff;
	z-index: 999999;
	-webkit-transform: translate3d(0, 100%, 0);
}

.close {
	position: absolute;
	right: 30rpx;
	top: 30rpx;
}

.pop-box .title {
	position: relative;
	display: block;
	width: 100%;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
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

@keyframes slideInDown {
	from {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}
	to {
		-webkit-transform: translate3d(0, 100%, 0);
		transform: translate3d(0, 100%, 0);
		visibility: hidden;
	}
}

.slideInDown {
	-webkit-animation-name: slideInDown;
	-webkit-animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: 1;
	-webkit-animation-duration: 300ms;
	-webkit-animation-fill-mode: forwards;
}

.scan-img {
	opacity: 0.4;
	width: 100%;
	height: 500rpx;
	position: absolute;
	z-index: 1;
}
.scano {
	opacity: 1;
}
.scan-text {
	font-size: 20px;
	color: $white;
	@include position-center;
}

.scan-text:after {
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
	animation: ellipsis 2s infinite;
	content: '\2026'; /* ascii code for the ellipsis character */
}
@keyframes ellipsis {
	from {
		width: 2px;
	}
	to {
		width: 20px;
	}
}
</style>
