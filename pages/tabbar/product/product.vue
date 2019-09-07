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
	</view>
</template>

<script>
	// import Name from './components/Name.vue'
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	export default {
		components: {
			mSearch
		},
		data() {
			return {
				defaultKeyword: "搜索商品名",
				keyword: "",
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

		},
		methods: {
			//执行搜索
			doSearch(key) {
				console.log(key)
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
