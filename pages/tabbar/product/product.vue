<template>
	<view class="content">
		<view class="search-box">
			<mSearch
			 class="mSearch-input-box"
			 button="inside"
			 :placeholder="defaultKeyword"
			 @search="doSearch(false)"
			 @confirm="doSearch(false)"
			 v-model="keyword"
			></mSearch>
		</view>
		<!-- 导航 -->
		<type-nav :list-data="busslistData"></type-nav>
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision';
	import typeNav from '../../common/type-bar'

	export default {
		components: {
			mSearch,
			typeNav
		},
		data() {
			return {
				defaultKeyword: '搜索商品名',
				keyword: '',

				biz_id: '', //商圈id
				busslistData: [], //分类数据
				businessid: '', //分类id

			}
		},
		props: {

		},
		computed: {

		},
		created() {

		},
		mounted() {

		},
		onLoad() {
			this.getClassifyData().then(response => {
				this.busslistData = response.data.businesslist
				this.businessid = ""
				this.biz_id = this.$api.$$get.login('biz_id')
				// this.getDiscountData()
			})
		},
		methods: {
			//执行搜索
			doSearch(key) {
				console.log(key)
			},
			/**
			 * 获取分类数据
			 */
			getClassifyData() {
				return new Promise((resolve, reject) => {
					this.$api.unifyAjax({
						data: {
							funcode: '0018'
						}
					}).then(resolve).catch(reject)
				});
			},
		}
	}
</script>

<style lang="scss">
	.search-box {
		width: 95%;
		background-color: rgb(242, 242, 242);
		padding: 15upx 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.search-box .mSearch-input-box {
		width: 100%;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.search-box .search-btn {
		width: 15%;
		margin: 0 0 0 2%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		font-size: 28upx;
		color: #fff;
		background: linear-gradient(to right, #ff9801, #ff570a);
		border-radius: 60upx;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 60upx;
		font-size: 32upx;
		border: 0;
		border-radius: 60upx;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #ffffff;
	}
</style>
