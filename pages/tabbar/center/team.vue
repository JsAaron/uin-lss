<template>
	<view v-if="showPage">
		<view class="team">
			<view class="team__header"><text>我的团队数据</text></view>
			<view class="team__box">
				<view class="team__total-text">团队总人数</view>
				<view class="team__total">{{ teamData.total_team }}</view>
				<view class="team__line" />
				<view class="team__row">
					<view class="team__col">
						<view>今日新增</view>
						<view class="team__number">{{ teamData.day_add }}</view>
					</view>
					<view class="team__col">
						<view>本月新增</view>
						<view class="team__number">{{ teamData.month_add }}</view>
					</view>
					<view class="team__col">
						<view>直属团队</view>
						<view class="team__number">{{ teamData.directly_team }}</view>
					</view>
					<view class="team__col">
						<view>直属团队下级</view>
						<view class="team__number">{{ teamData.directly_team_xj }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="team">
			<view class="team__header"><text>团队数据明细</text></view>
			<view class="team__box">
				<view class="team__content">
					<view>
						<view>会员</view>
						<view class="team__count">{{ teamData.general_member }}</view>
					</view>
					<view>
						<view>创客</view>
						<view class="team__count">{{ teamData.general_maker }}</view>
					</view>
					<view>
						<view>金牌创客</view>
						<view class="team__count">{{ teamData.general_gold }}</view>
					</view>
					<view>
						<view>钻石创客</view>
						<view class="team__count">{{ teamData.general_jewel }}</view>
					</view>
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
			showPage: false,
			teamData: {}
		};
	},
	onLoad() {
		this.getInitData();
	},
	methods: {
		/**
		 * 设置显示数据
		 */
		getInitData() {
			util.showBusy();
			util
				.md5Ajax({
					funcode: '0190',
					encrypt: {
						data: {
							agentid: $$get.login('taccountid')
						}
					}
				})
				.then(response => {
					util.hideBusy();
					this.showPage = true;
					this.teamData = response.data;
				});
		}
	}
};
</script>

<style lang="scss">
.team {
	width: 700rpx;
	margin: 0 auto;
	padding-top: 80rpx;

	&__header {
		border-left: 20rpx solid $blue;
		margin: 0 auto 40rpx auto;
		font-size: 40rpx;
		text-indent: 30rpx;
		width: 600rpx;
	}

	&__box {
		overflow: hidden;
		background: ￥white;
		border: 1px solid #1a1a1a;
		border-radius: 10rpx;
	}

	&__total-text {
		color: #4f96ff;
		font-size: 40rpx;
		margin-top: 30rpx;
		text-align: center;
	}

	&__total {
		color: #ff4f57;
		font-size: 40rpx;
		margin: 20rpx;
		text-align: center;
	}

	&__line {
		width: 70%;
		margin-left: 15%;
		height: 10rpx;
		border-top: 3px dashed #ff4f57;
	}

	&__row {
		margin-top: 28rpx;
		display: flex;
	}

	&__col {
		font-size: 25rpx;
		text-align: center;
		flex: 1;

		padding: 20rpx 0;
		margin-bottom: 20rpx;
	}

	&__number {
		color: #f30707;
		font-size: 30rpx;
		margin-top: 20rpx;
	}

	&__content {
		padding: 30rpx 0;
		@include flex-h-around;
		text-align: center;
		font-size: 30rpx;
	}

	&__count {
		margin-top: 20rpx;
		color: #f30707;
		font-size: 35rpx;
	}
}
</style>
