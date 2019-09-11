<template>
	<view class="pop-box" :class="[animateClass]">
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
				style="width: 100%; height: 500upx;"
			>
				<cover-image
					:src="image ? image : bg"
					class="scan-img"
					:class="{ scano: image }"
				></cover-image>
			</camera>
		</view>

		<block v-if="image">
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
					poptitle: ''
				};
			}
		}
	},
	data() {
		return {
			title: '',
			showCamera: false,
			animateClass: '',
			bg: '/static/components/scan-frame/scan-img.png',
			image: '',
			succeed: false,
			stauts: false //false 关闭  true 打开
		};
	},
	created() {
		// this.animateClass = 'slideInUp';
		// this.poptitle = this.dataSet.poptitle
	},
	watch: {
		'dataSet'(val, oldVal) {
			console.log(val,oldVal);
			if (val) {
				this.showCamera = true;
				this.title = val.poptitle;
				this.animateClass = 'slideInUp';
			}
		}
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
		onClose() {
			this.animateClass = 'slideInDown';
			setTimeout(() => {
				this.title = '';
				this.dataSet.poptitle = ''
				this.showCamera = false;
			}, 300);
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
}
.scano {
	opacity: 1;
}
.scan-text {
	font-size: 20px;
	text-align: center;
	line-height: 60rpx;
}
</style>
