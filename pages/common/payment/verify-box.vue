<template>
	<view class="page">
		<view class="alert">
			<view class="main" :class="{ show: show }">
				<image class="icon" src="/static/components/verify-box/alert-1.png"></image>
				<view class="text">请输入短信验证码</view>
				<view class="code">
					<input
						type="number"
						v-for="(o, i) in list"
						v-model="o.val"
						:key="i"
						:focus="o.fs"
						:class="{ focus: o.fs }"
						@focus="onFocus(i)"
						@blur="onBlur(i)"
						@input="onInput($event, i)"
					/>
				</view>
				<view class="btns" @click="onSubmit" hover-class="none">提交验证码</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 验证码的个数（现在是6个）
			list: [
				{ val: '', fs: true }, // 初始发时使第一个输入框架得到焦点
				{ val: '', fs: false },
				{ val: '', fs: false },
				{ val: '', fs: false },
				{ val: '', fs: false },
				{ val: '', fs: false }
			],
			show: false
		};
	},
	
	//隐藏清空密码
	onHide(){
		this.list = []
	},

	onReady() {
		// 显示弹出动画开关
		this.show = true;
	},

	methods: {
		// 当输入框的内容改变时的操作
		onInput(e, i) {
			// 输入完成时，跳到下一个输入框(得到焦点)
			if (i < this.list.length - 1 && e.target.value) {
				// 如果下一个输入框有值，则不跳
				if (!this.list[i + 1].val) this.onFocus(i + 1, true);
			}

			// 删除时，跳到上一个输入框
			if (i && !e.target.value) {
				// if(!this.list[i - 1].val)
				this.onFocus(i - 1, true);
			}
		},

		// 得到焦点 激活下边框样式
		onFocus(i, t) {
			// this.list[i].val = '';	// 清除输入框中的内容
			this.list[i].fs = true;
		},

		// 失去焦点 去除下边框样式
		onBlur(i) {
			this.list[i].fs = false;
		},

		// 提示验证码方法
		onSubmit() {
			let code = '';
			for (let i = 0, len = this.list.length; i < len; i++) {
				// 获取用户输入的验证码
				code += this.list[i].val;
			}
			if (code && 6 == code.length) {
				this.$emit('click',code)
			} else {
				uni.showToast({
					title: '请正确输入验证码！',
					image: '/static/components/verify-box/alert-3.png',
					duration: 3000
				});
			}
		}
	}
};
</script>

<style lang="scss">
.page {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-size: cover;
}
.page .alert {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
}
.page .alert .main {
	position: relative;
	display: none;
	flex-direction: column;
	align-items: center;
	padding: 50upx;
	border-radius: 12upx;
	width: 480upx;
	height: 360upx;
	background: rgba(255, 255, 255, 0);
	margin-top: -100rpx;
}
.page .alert .main .icon {
	position: absolute;
	top: -48upx;
	width: 98upx;
	height: 98upx;
	background-size: contain;
}
.page .alert .main .text {
	padding: 50upx 0;
	color: #4c4e60;
	font-size: 32upx;
}
.page .alert .main .code {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 30upx 0 50upx;
	width: 360upx;
}
.page .alert .main .code input {
	width: 40upx;
	height: 40upx;
	line-height: 40upx;
	border: none;
	border-bottom: 4upx solid #b2bfbd;
	text-align: center;
	color: #4c4e60;
	font-size: 46upx;
}
.page .alert .main .code input.focus {
	border-color: #4c79fa;
}
.page .alert .main .btns {
	width: 360upx;
	height: 80upx;
	line-height: 80upx;
	border-radius: 40upx;
	text-align: center;
	color: white;
	font-size: 32upx;
	font-weight: bold;
	background: #4f96ff;
	&:active{
		transform: scale(0.95);
	}
}
@keyframes show {
	0% {
		transform: scale(0);
		background: rgba(255, 255, 255, 0.3);
	}
	50% {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 0.6);
	}
	100% {
		transform: scale(1);
		background: rgba(255, 255, 255, 1);
	}
}
.page .alert .show {
	display: flex !important;
	animation: show 0.6s ease-in-out forwards;
}
</style>
