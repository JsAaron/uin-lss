<script>
import { getRouterPath } from '@/utils/router';
export default {
	globalData: {
		route: {}, //路由页面
		/**
		 * 设置需要刷新的路由页面
		 * value: prev
		 */
		setPageRefresh(value) {
			let path = getRouterPath(value);
			if (path) {
				this.route[path] = true;
			}
		},
		/**
		 * 检测是否刷新页面
		 * 根据当前页面的router是否被设置判断
		 */
		getPageRefresh() {
			var path = getRouterPath();
			if(this.route[path]){
				delete this.route[path] //删除
				console.log('刷新页面onshow方法',path)
				//可以刷新
				return true
			}
		}
	},
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	-webkit-font-smoothing: antialiased;
	// font-family: "PingFang SC", Helvetica, "STHeiti STXihei", "Microsoft YaHei",
	//   Tohoma, Arial, sans-serif;
	font-family: Arial;
	background: rgb(242, 242, 242);
	position: relative;
	font-size: 16px;
	font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-webkit-tap-highlight-color: transparent;
}

/* 默认去边框  */
button[plain] {
	border: 0;
}

// 去边框
button::after {
	border: none;
}

input {
	outline: none;
	border: none;
	list-style: none;
}
</style>
