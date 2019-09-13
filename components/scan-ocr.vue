<template>
	<view class="pop-box" :class="[popAnimateClass]">
		<view class="title lss-hairline--top">
			<text>{{ title }}</text>
			<uni-icon type="cross" class="close" @tap="onClose" size="18">关闭</uni-icon>
		</view>
		<view class="content">
			<camera
				v-if="showCamera"
				:device-position="devicePosition"
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
				<view :class="[swiperAnimate]"></view>
				<view class="scan-text" :class="{ dot: hasDot }">{{ scanText }}</view>
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
					title: '',
					type: '',
					side: '',
					devicePosition: '', //摄像头位置
					verify: true //是否需要验证
				};
			}
		}
	},
	data() {
		return {
			title: '',
			devicePosition: 'back',
			scanText: '识别中',
			showCamera: false,
			popAnimateClass: '',
			swiperAnimate: '',
			scanImageSrc: '',
			hasDot: true,
			state: false
		};
	},
	watch: {
		dataSet(val, oldVal) {
			if (this.state) {
				return;
			}
			this.state = true;
			if (Object.keys(val).length) {
				this.devicePosition = val.devicePosition || 'back';
				this.title = val.title;
				this.popAnimateClass = 'slideInUp';
				this.showCamera = true;
			}
		}
	},

	methods: {
		resetText(text) {
			this.scanText = text;
			this.swiperAnimate = '';
			this.hasDot = false;
		},

		/**
		 * 识别完成
		 */
		complete(data = {}) {
			data.image = this.scanImageSrc;
			data.type = String(this.dataSet.type);
			data.side = String(this.dataSet.side);
			this.$emit('complete', data);
			setTimeout(
				() => {
					this.clean();
				},
				this.dataSet.noVerify ? 0 : 1500
			);
		},

		requestParse(base64Data) {
			//如果不要验证
			if (this.dataSet.noVerify) {
				this.complete();
				return;
			}

			uni.request({
				url: 'https://lss.facess.net/card-server/baidu/ocr',
				data: JSON.stringify({
					type: String(this.dataSet.type),
					image: base64Data,
					side: String(this.dataSet.side)
				}),
				method: 'POST',
				dataType: 'json',
				header: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				success: res => {
					//身份证
					if (this.dataSet.type == 2) {
						//身份证正面照
						if (this.dataSet.side == 'front') {
							if (!res.data.data.name && !res.data.data.id_card) {
								this.resetText('未能识别图片,请重拍照');
							}
							if (res.data.data.name && res.data.data.id_card) {
								this.resetText('识别成功');
								this.complete({
									name: res.data.data.name,
									id_card: res.data.data.id_card
								});
							}
							if (res.data.data.name && !res.data.data.id_card) {
								this.resetText('未能识别证件码,请重拍照');
							}
							if (!res.data.data.name && res.data.data.id_card) {
								this.resetText('未能识别姓名,请重拍照');
							}
						}
						//身份证反面照
						if (this.dataSet.side == 'back') {
							if (res.data.data.issuing_date) {
								this.resetText('识别成功');
								this.complete();
							} else {
								this.resetText('未能识别图片,请重拍照');
							}
						}
						return;
					}

					// 无法识别的图片
					this.resetText('无法识别该图片');
				},
				fail(e) {
					console.log('e', e);
				}
			});
		},

		takePhoto() {
			this.scanText = '识别中';
			this.hasDot = true;
			const ctx = uni.createCameraContext();
			ctx.takePhoto({
				quality: 'high',
				success: res => {
					this.scanImageSrc = res.tempImagePath;
					this.showCamera = false;
					this.swiperAnimate = 'swiper-animate';
					wx.compressImage({
						src: this.scanImageSrc, // 图片路径a
						quality: 80, // 压缩质量
						complete: res => {
							let tempPath = res.tempFilePath ? res.tempFilePath : this.scanImageSrc;
							util.getFileSize(tempPath).then(newSize => {
								console.log(`系统方法压缩后${parseInt(newSize / 1024)}k`);
								util.converFileEncode(tempPath).then(res => {
									this.requestParse(res.data);
								});
							});
						}
					});
				}
			});
		},

		clean() {
			this.$emit('update:dataSet', {});
			this.scanImageSrc = '';
			this.showCamera = false;
			setTimeout(() => {
				this.state = false;
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
			this.scanImageSrc = '';
			this.showCamera = true;
			this.scanText = '识别中';
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
	width: 100%;
	text-align: center;
	font-size: 22px;
	color: red;
	@include position-center;
}

.dot:after {
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
