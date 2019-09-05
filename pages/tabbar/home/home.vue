<template>
	<view>1</view>
</template>

<script>
import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';
export default {
	data() {
		return {
			avatarUrl: '',
			biz_id: '',

			// 商圈数据
			businessDisplay: false,
			businessZoom: '',
			businessListData: [], //商圈数据
			businessid: '', //商圈类型

			// 推荐
			listData: [], //列表数据
			listTotalPage: 0, //列表页面数
			listCurrentPage: 0, //列表当前页面获取的数量

			goodslistData: [], //商品
			busslistData: [], //分类列表
			agentlistData: [] //附近商家
		};
	},
	onLoad() {
		this.avatarUrl = $$get.avatarUrl();
		util
			.getLocationData()
			.then(res => {
				$$set.location(res.latitude, res.longitude);
				this.initData();
			})
			.catch(() => {
				this.initData();
			});
	},
	methods: {
		initData() {
			this.getBusinessData().then(() => {
				this.getAllData();
				//获取商家数据
				this.getShopData({
					businessid: ''
				});
			});
		},

		/**
		 * 获取商家数据
		 */
		getShopData({ isPull, refresh, businessid, agentname } = {}) {
			return new Promise((resolve, reject) => {
				!refresh && !isPull && this.$api.showBusy();
				let data = {
					agentid: $$get.agentid() || '111', //没有登陆传111
					latitude: $$get.location('latitude'),
					longitude: $$get.location('longitude')
				};
				let request = {
					businessid: businessid,
					agentname: agentname,
					pageno: ++this.listCurrentPage,
					pagesize: 10,
					biz_id: this.biz_id
				};
				util
					.md5Ajax({
						funcode: '0072',
						encrypt: { data },
						request
					})
					.then(response => {
						if (isPull) {
							this.listData = this.listData.concat(response.data.list);
						} else {
							this.listData = response.data.list;
							this.listTotalPage = response.data.totalPage;
						}
						!refresh && !isPull && this.$api.hideBusy();
						resolve(response);
					})
					.catch(err => {
						!refresh && !isPull && this.$api.hideBusy();
						reject();
					});
			});
		},

		/**
		 * 获取所有数据
		 * businessid 类型
		 */
		getAllData(businessid, refresh) {
			this.businessid = businessid;
			return new Promise((resolve, reject) => {
				!refresh && this.$api.showBusy();
				let data = {
					agentid: $$get.agentid() || '111', //没有登陆传111
					latitude: $$get.location('latitude'),
					longitude: $$get.location('longitude')
				};
				let request = {
					businessid: businessid,
					biz_id: this.biz_id
				};
				util
					.md5Ajax({
						funcode: '0181',
						encrypt: { data },
						request
					})
					.then(response => {
						this.agentlistData = response.data.agentlist;
						this.busslistData = response.data.busslist;
						this.goodslistData = response.data.goodslist;
						resolve();
						!refresh && this.$api.hideBusy();
					})
					.catch(() => {
						!refresh && this.$api.hideBusy();
						reject();
					});
			});
		},

		/**
		 * 获取商圈数据
		 */
		getBusinessData() {
			return new Promise((resolve, reject) => {
				util
					.unifyAjax({
						data: {
							funcode: '0133',
							latitude: String($$get.location('latitude')),
							longitude: String($$get.location('longitude'))
						}
					})
					.then(response => {
						const list = response.data.list;
						const data = list[0];
						this.businessListData = list;
						this.biz_name = data.biz_name;
						this.biz_id = data.biz_id;
						$$set.login('biz_id', data.biz_id);
						resolve();
					})
					.catch(reject);
			});
		}
	}
};
</script>

<style></style>
