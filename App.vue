<script>
export default {
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
</style>
