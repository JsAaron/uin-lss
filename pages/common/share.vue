<template>
	<view class="share">
		<canvas
			v-if="poster"
			class="goods"
			style="{width:boxWidth+'px',height:boxHeight + 'px',top:boxTop + 'px'}"
			canvas-id="myCanvas"
			@longtap="onShare"
		/>

		<!-- 分享图 -->
		<view v-if="posterHandle" class="share__poster" :clsss="posterClass">
			<view class="share__poster-title">
				<text>分享海报给好友</text>
				<icon
					class="share__poster-icon"
					@tap="onCloseDown"
					type="cancel"
					size="20"
					color="#999"
				/>
			</view>
			<view class="share__row">
				<view class="share__col share__col--active" @tap="onShare">
					<image class="share__img" src="/static/components/share/3.png" />
					<text class="share__poster--text">预览分享</text>
				</view>
				<view class="share__col share__col--active" @tap="onSave">
					<image class="share__img" src="/static/components/share/5.png" />
					<text class="share__poster--text">保存本地</text>
				</view>
			</view>
		</view>

		<!-- 分享按钮 -->
		<view class="share__content" :class="slideClass">
			<view class="share__title">分享给好友</view>
			<view class="share__row">
				<button class="share__col share__col--active" open-type="share" plain="true">
					<image class="share__img" src="/static/components/share/3.png" />
					<text class="share__text">微信</text>
				</button>
				<button class="share__col share__col--active" plain="true" @tap="onPoster">
					<image class="share__img" src="/static/components/share/2.png" />
					<text class="share__text">生成海报</text>
				</button>
			</view>
			<view class="share__row share__close">
				<view class="share__col">
					<image
						class="share__close-img"
						@tap="onClose"
						src="/static/components/share/4.png"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	components: {},
	data() {
		return {
			poster: false,
			posterClass: '',
			boxWidth: '',
			boxHeight: '',
			boxTop: '-100%',
			slideClass: '',
			thinkList: [], //文字超出换行处理
			contentTitle: '', //商品标题
			price: '', //商品价格
			delPrice: '', //划线价
			canvasUrl: '', //canvas

			userImgSrc: '',
			qrImgSrc: '',
			hasCanvas: false
		};
	},
	props: {
		shareData: {
			type: Object,
			value: {}
		}
	},
	created() {
		this.initData();
	},
	onLoad() {},
	methods: {
		initData() {
			this.slideClass = 'slideIn--up';
		},

		/**
		 * 关闭
		 */
		onClose() {
			this.slideClass = 'slideIn--down';
			this.$emit('beforeClose');
			setTimeout(() => {
				this.$emit('close');
			}, 300);
		},

		/**
		 * 关闭海报下载
		 */
		onCloseDown() {
			this.poster = false;
			this.posterClass = 'slideIn--down';
			this.onClose();
		},

		initUrlData(callback) {
			Promise.all([
				util.getWinxinAvatarUrl($$get.userInfo('avatarUrl')).then(wxImage => {
					this.userImgSrc = wxImage;
				}),
				util
					.getShareQrCode({
						device: $$get.device(),
						agentidsp: this.shareData.agentidsp,
						goodsid: this.shareData.goodsid,
						fagentid: $$get.login('taccountid')
					})
					.then(res => {
						this.qrImgSrc = res.data.tgimg;
					})
			]).then(() => {
				callback && callback();
			});
		},

		createBox() {
			let windowWidth = util.getWindowWidth();
			let windowHeight = util.getWindowHeight();

			//容器的宽高
			let boxWidth = windowWidth * 0.7;
			let boxHeight = windowHeight;

			//图片尺寸
			let imgHeight = (boxWidth / 5) * 4;
			this.boxWidth = boxWidth;
			this.boxHeight = boxHeight;
			this.offsetX = 0;
			this.spaceY = 10;
			this.imgWidth = boxWidth;
			this.imgHeight = imgHeight;

			Promise.all([
				this.getTempFile(this.shareData.goodsImage).then(tempFilePath => {
					this.tempGoodsImage = tempFilePath;
				}),
				this.getTempFile(this.userImgSrc).then(tempFilePath => {
					this.tempUserImgSrc = tempFilePath;
				}),
				this.getTempFile(this.qrImgSrc).then(tempFilePath => {
					this.tempQrImgSrc = tempFilePath;
				})
			])
				.then(() => {
					this.createGoodsPoster();
				})
				.catch(e => {
					util.hideBusy();
				});
		},

		//画矩形，也是整块画布的大小，宽度是屏幕宽度，高度根据内容多少来动态设置。
		drawSquare(ctx) {
			ctx.rect(0, 0, this.boxWidth, this.boxHeight);
			ctx.setFillStyle('#fff');
			ctx.fill();
		},

		/**
		 * 绘制logo图
		 */
		drawLogo(ctx) {
			ctx.drawImage(this.tempGoodsImage, 0, 0, this.imgWidth, this.imgHeight);
			this.logoTop = this.imgHeight;
		},

		/**
		 * 微信头像
		 */
		createHeadPhoto(ctx) {
			let w = this.boxWidth * 0.15;
			let x = this.spaceY;
			let y = this.imgHeight + this.spaceY;

			ctx.save();
			ctx.beginPath();
			ctx.arc(x + w / 2, y + w / 2, w / 2, 0, Math.PI * 2, false);
			ctx.clip();
			ctx.drawImage(this.tempUserImgSrc, x, y, w, w);
			ctx.restore();

			ctx.setFontSize(10);
			ctx.setFillStyle('#333');
			ctx.fillText(
				this.shareData.nickName,
				w + x + this.spaceY,
				y + w / 2 + this.spaceY / 2
			);

			//头像高度
			this.headerTop = y + w;
		},

		/**
		 * 标题换行
		 */
		wrapTitle() {
			let i = 0;
			let lineNum = 1;
			let thinkStr = '';
			let thinkList = [];
			for (let item of this.shareData.contentTitle) {
				if (item === '\n') {
					thinkList.push(thinkStr);
					thinkList.push('a');
					i = 0;
					thinkStr = '';
					lineNum += 1;
				} else if (i === 11) {
					thinkList.push(thinkStr);
					i = 1;
					thinkStr = item;
					lineNum += 1;
				} else {
					thinkStr += item;
					i += 1;
				}
			}
			thinkList.push(thinkStr);
			return thinkList;
		},

		/**
		 * 创建标题
		 */
		createTitle(ctx) {
			let thinkList = this.wrapTitle();
			let height = 20;
			for (let item of thinkList) {
				ctx.setFontSize(12);
				ctx.setFillStyle('#000');
				this.titleTop = this.headerTop + height + this.spaceY;
				ctx.fillText(item, 10, this.titleTop);
				height += 20;
			}
		},

		/**
		 * 价格
		 */
		createPrice(ctx) {
			this.priceTop = this.titleTop + 30;

			// 填充价格符号￥
			ctx.setFillStyle('#cb4255');
			ctx.font = 'normal normal 15px sans-serif';
			ctx.fillText('￥', 10, this.priceTop);

			// 填充价格文字
			ctx.font = 'normal bold 20px sans-serif';
			ctx.fillText(this.shareData.price, 25, this.priceTop);

			// 计算价格符号￥ + 价格文字宽度
			let priceWidth = ctx.measureText('￥' + this.shareData.price).width;
			// 填充划线价文字
			ctx.setFillStyle('#999');
			ctx.font = 'normal normal 13px sans-serif';
			ctx.fillText(this.shareData.delPrice, priceWidth + 10, this.priceTop);
			// 计算划线价宽度
			let delPriceWidth = ctx.measureText(this.shareData.delPrice).width;
			// 填充划线价横线
			ctx.beginPath();
			ctx.moveTo(priceWidth + 12, this.priceTop - 4);
			ctx.lineTo(priceWidth + delPriceWidth + 12, this.priceTop - 4);
			ctx.setStrokeStyle('#999');
			ctx.stroke();
			ctx.closePath();
		},

		/**
		 * 分享二维码
		 */
		createQr(ctx) {
			let w = this.boxWidth * 0.28;
			let x = this.boxWidth * 0.68;
			let y = this.logoTop + 10;

			ctx.drawImage(this.tempQrImgSrc, x, y, w, w);

			// 填充长按立即购买文本
			ctx.setFillStyle('#999');
			ctx.font = 'normal normal 8px sans-serif';
			ctx.fillText('扫描进入查看详情', x + 7, y + w + 15);
		},

		createGoodsPoster() {
			let ctx = wx.createCanvasContext('myCanvas', this);

			//box
			this.drawSquare(ctx);

			//商品图片
			this.drawLogo(ctx);

			//头像
			this.createHeadPhoto(ctx);

			//标题
			this.createTitle(ctx);

			//价格
			this.createPrice(ctx);

			//二维码
			this.createQr(ctx);

			this.setData({
				boxHeight: this.data.priceTop + 20
			});

			ctx.draw();

			this.showPosterHandle();

			setTimeout(() => {
				util.hideBusy();
				this.hasCanvas = true;
				this.setData({
					top: (this.windowHeight - this.priceTop - 20) / 4
				});
			}, 0);
		},

		//分享海报
		onShare() {
			wx.canvasToTempFilePath(
				{
					x: 0,
					y: 0,
					canvasId: 'myCanvas',
					success: res => {
						wx.hideLoading();
						var tempFilePath = res.tempFilePath;
						this.setData({
							canvasUrl: tempFilePath
						});
						if (tempFilePath !== '') {
							wx.hideLoading();
							wx.previewImage({
								current: this.canvasUrl, // 当前显示图片的http链接
								urls: [this.canvasUrl], // 需要预览的图片http链接列表
								success: () => {}
							});
						}
					}
				},
				this
			);
		},

		//点击保存到相册
		onSave() {
			const downImage = () => {
				util.showBusy('保存相册');
				wx.canvasToTempFilePath(
					{
						x: 0,
						y: 0,
						canvasId: 'myCanvas',
						success: res => {
							var tempFilePath = res.tempFilePath;
							wx.saveImageToPhotosAlbum({
								filePath: tempFilePath,
								success: () => {
									util.hideBusy();
									wx.showModal({
										content: '图片成功保存到相册了，快去分享朋友圈吧~',
										showCancel: false,
										confirmText: '好的',
										confirmColor: '#333',
										success: res => {
											if (res.confirm) {
												this.onClickBackdrop();
											}
										},
										fail: function(res) {
											console.log(111, res);
										}
									});
								},
								fail: function(res) {
									util.hideBusy();
									util.showToast('图片保存失败');
								}
							});
						}
					},
					this
				);
			};

			util
				.detectAccredit('scope.writePhotosAlbum')
				.then(() => {
					downImage();
				})
				.catch(() => {
					let data = {
						content: '您未启动保存图片权限，我们无法下载图片到相册',
						scope: 'scope.writePhotosAlbum',
						buttonText: '授权保存到相册',
						describe: '亲，我们未获得您的保存相册授权，将无法为您提供二维码保存功能！'
					};
					util.gotoPage(`/common/accredit/accredit?data=${JSON.stringify(data)}`);
					this.action = 'accredit-writePhotosAlbum';
				});
		},

		//临时图片路径
		getTempFile(url) {
			return new Promise((resolve, reject) => {
				wx.downloadFile({
					url: url,
					success(res) {
						resolve(res.tempFilePath);
					},
					fail(err) {
						console.log(err);
					}
				});
			});
		},

		/**
		 * 生成海报
		 */
		onPoster() {
			this.poster = true;
			if (this.hasCanvas) {
				this.showPosterHandle();
			} else {
				util.showBusy('生成海报中');
				this.initUrlData(() => {
					this.createBox();
				});
			}
		},

		showPosterHandle() {
			this.posterHandle = true;
			this.slideClass = 'slideIn--down';
			this.posterClass = 'slideIn--up';
		}
	}
};
</script>

<style lang="scss">
.share {
	background: rgba(0, 0, 0, 0.6);
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 9999;

	&__content {
		@include flex-v-around;
		visibility: hidden;
		width: 100%;
		position: absolute;
		bottom: 50rpx;
		z-index: 2;
		color: $white;
		height: 500rpx;
	}

	&__title {
		text-align: center;
		font-size: 28rpx;
	}

	&__img {
		width: 80rpx;
		height: 80rpx;
	}

	&__row {
		@include flex-h-around;
		width: 100%;
	}

	&__col {
		padding-top: 20rpx;
		flex: 1;
		@include flex-v-around;
		&--active {
			&:active {
				background: #c9c9c9;
			}
		}
	}

	&__text {
		color: $white;
		font-size: 22rpx;
	}

	&__close-img {
		width: 64rpx;
		height: 64rpx;
	}

	&__poster {
		width: 100%;
		position: absolute;
		bottom: 0;
		z-index: 111111;
		@include flex-v-around;
		color: $white;
		background: #ffffff;
		color: black;
		border-top-right-radius: 15rpx;
		border-top-left-radius: 15rpx;
		height: 250rpx;
		&--text {
			color: black;
			font-size: 22rpx;
			margin-top: 20rpx;
		}
	}
	&__poster-title {
		@include flex-h;
		width: 100%;
		position: relative;
		font-size: 28rpx;
	}

	&__poster-icon {
		position: absolute;
		right: 30rpx;
	}
}

.goods {
	left: 15%;
	top: -100%;
	position: fixed;
	z-index: 11111;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.fade--in {
	animation-name: fadeIn;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}

@keyframes fadeOut {
	from {
		opacity: 1;
	}

	to {
		opacity: 0;
	}
}

.fade--out {
	animation-name: fadeOut;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}

@keyframes slideInUp {
	from {
		visibility: visible;
		transform: translate3d(0, 100%, 0);
	}

	to {
		visibility: visible;
		transform: translate3d(0, 0%, 0);
	}
}

.slideIn--up {
	animation-name: slideInUp;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}

@keyframes slideInDown {
	from {
		visibility: visible;
		transform: translate3d(0, 0, 0);
	}

	to {
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
	}
}

.slideIn--down {
	animation-name: slideInDown;
	animation-iteration-count: 1;
	animation-duration: 300ms;
	animation-fill-mode: forwards;
}
</style>
