<template>
	<view class="button">
		<!-- 底部按钮 -->
		<block v-if="position == 'button'">
			<waves-button
				@click="this.$emit('click')"
				:btnStyle="buttomStyle"
				wavesColor="rgba(79,150,255)"
			>
				<slot></slot>
			</waves-button>
		</block>
		<block v-else>
			<waves-button
				@click="this.$emit('click')"
				btnStyle="background:linear-gradient(to right,#65a1fb, #4f96ff);border-radius:5px"
				wavesColor="rgba(79,150,255)"
			>
				<slot></slot>
			</waves-button>
		</block>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import wavesButton from '@/components/waves-button/waves-button';
export default {
	components: {
		wavesButton
	},
	data() {
		return {};
	},
	props: {
		/**
		 * 按钮类型
		 * 默认主按钮
		 */
		type: {
			type: String,
			default: 'primary'
		},
		/**
		 * 水波纹特效
		 */
		waves: {
			type: Boolean,
			default: false //默认启动
		},
		/**
		 * 默认位置
		 */
		position: {
			type: String,
			default: ''
		},
		/**
		 * 按钮颜色
		 */
		color: {
			type: String,
			default: '#4f96ff'
		}
	},
	data() {
		return {
			buttomStyle:
				'position:fixed;left:0;bottom:0;width:100%;height:100rpx;color:#fff;;background:linear-gradient(to right,#65a1fb, #4f96ff);border-radius:0'
		};
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
// .button{
// 	margin: 0 auto;
// }
</style>
