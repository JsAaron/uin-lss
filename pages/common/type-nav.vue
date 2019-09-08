<template>
	<view class="nav">
		<view class="nav__row">
			<block v-for="(item, index) in listData" :key="index">
				<view class="nav__col" :data-id="item.businessid" @tap="onSwitchType">
					<image class="nav__logo" :src="imgDomain + item.imgpath" />
					<text
						class="nav__text"
						:class="[item.businessid == bid ? 'nav__text--active' : '']"
					>
						{{ item.businessname }}
					</text>
					<view
						class="nav__line"
						:class="[item.businessid == bid ? 'nav__line--active' : '']"
					/>
				</view>
			</block>
		</view>
		<view class="nav__placeholder" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgDomain: ''
		};
	},
	props: {
		listData: {
			type: Array,
			default() {
				return [];
			}
		},
		bid: {
			type: String,
			value: ''
		}
	},
	created() {
		this.imgDomain = this.$api.imgDomain;
	},
	components: {},
	methods: {
		onSwitchType(e) {
			this.$emit('get-typeid', e.currentTarget.dataset.id);
		}
	}
};
</script>

<style lang="scss">
.nav {
	&__row {
		@include flex-h-around;
		background: $white;
	}

	&__col {
		@include flex-v;
		padding: 20rpx 0 10rpx 0;

		&:active {
			color: $blue;
		}
	}

	&__logo {
		width: 80rpx;
		height: 80rpx;
	}

	&__text {
		font-size: 28rpx;
		margin-top: 10rpx;

		&--active {
			color: $blue;
		}
	}

	&__placeholder {
		height: 20rpx;
	}

	&__line {
		width: 100%;
		height: 5rpx;
		margin-top: 5rpx;

		&--active {
			background: $blue;
		}
	}
}
</style>
