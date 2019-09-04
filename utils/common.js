
export function showBusy(title) {
	uni.showLoading({
		title: title || "载入中..."
	});
}

export function hideBusy() {
	uni.hideLoading();
}

/**
 * 
 * @param {*} arg1
 * @param {*} arg2 
 * @param {*} arg3 
 */
export function showToast(arg1, arg2, arg3) {

	// showToast("success","成功",20F00)
	// showToast("fail","失败",2000)
	if (arg1 === "success" || arg1 === "fail") {

		//如果是成功，带对象参数，支持回调
		if (typeof arg2 === "object") {
			let data = arg2
			data.image = `/assets/images/icon/${arg1}.png`
			return uni.showToast(data);
		}

		//不带对象参数
		return uni.showToast({
			mask: true,
			title: arg2,
			icon: "cancel",
			image: `/assets/images/icon/${arg1}.png`,
			duration: arg3 || 2000
		});
	}

	// util.showToast({
	//   title: '网络异常,语音播放无法正常使用',
	// })
	if (typeof arg1 === "object") {
		let data = arg1
		return uni.showToast(data);
	}

	// showToast("发送成功",2000,"success")
	return uni.showToast({
		mask: true,
		title: arg1,
		icon: arg3 || "none",
		duration: arg2 || 2000
	});
}

export function hideToast(text, time, icon) {
	return uni.hideToast();
}
