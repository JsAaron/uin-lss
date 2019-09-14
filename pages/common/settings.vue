<template>
	<view>
		<view class="example-title">登录密码</view>
		<uni-list>
			<uni-list-item
				:show-extra-icon="true"
				:extra-icon="extraIcon"
				title="修改登录密码"
				@click="gotoPage('/pages/common/password/change?pageMode=login')"
			/>
			<uni-list-item
				:show-extra-icon="true"
				:extra-icon="extraIcon"
				title="重设登录密码"
				@click="gotoPage('/pages/common/password/reset?pageMode=login')"
			/>
		</uni-list>
		<view class="example-title">支付密码</view>
		<uni-list>
			<uni-list-item
				:show-extra-icon="true"
				:extra-icon="extraIcon"
				title="修改支付密码"
				@click="gotoPage('/pages/common/password/change')"
			/>
			<uni-list-item
				:show-extra-icon="true"
				:extra-icon="extraIcon"
				title="重设支付密码"
				@click="gotoPage('/pages/common/password/reset')"
			/>
		</uni-list>
		<view class="example-title">账户切换</view>
		<uni-list>
			<uni-list-item
				:show-extra-icon="true"
				:extra-icon="extraIcon"
				title="换账号登录"
				@click="gotoPage('/common/login/login?pageType=merchant&switch=true')"
			/>
			<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon" title="退出登录" @click="bindLogout" />
		</uni-list>
	</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
import uniList from '@/components/uni/uni-list/uni-list.vue';
import uniListItem from '@/components/uni/uni-list-item/uni-list-item.vue';
export default {
	components: { uniList, uniListItem },
	data() {
		return {
			extraIcon: { color: '#007aff', size: '22', type: 'gear' }
		};
	},
	props: {},
	created() {},
	onLoad() {},
	methods: {
		gotoPage(url) {
			util.gotoPage(url);
		},
		/**
		 * 注销用户
		 */
		bindLogout() {
			wx.showModal({
				title: '温馨提示',
				content: '注销当前用户?',
				success(res) {
					if (res.confirm) {
						util.showBusy('注销中...');
						util
							.md5Ajax({
								funcode: '0155',
								encrypt: {
									data: {
										agentid: $$get.login('taccountid')
									}
								}
							})
							.then(() => {
								app.$$emptyLoginData();
								util.showToast('success', '注销成功', 2000);
								setTimeout(() => {
									util.hideBusy();
									util.gotoPage('reLaunch', '/pages/tabbar/my/my');
								}, 2000);
							})
							.catch(errResponse => {
								util.hideBusy();
								util.showToast(errResponse.data.retMsg);
							});
					} else {
						//取消
						util.hideBusy();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background: $page-background-color;
}
.example-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32upx;
	color: #464e52;
	padding: 30upx 30upx 30upx 50upx;
	margin-top: 20upx;
	position: relative;
	// background-color: #fdfdfd;
	border-bottom: 1px #f5f5f5 solid;
}
.example-title__after {
	position: relative;
	color: #031e3c;
}
.example-title:after {
	content: '';
	position: absolute;
	left: 30upx;
	margin: auto;
	top: 0;
	bottom: 0;
	width: 6upx;
	height: 32upx;
	background-color: #ccc;
}
</style>
