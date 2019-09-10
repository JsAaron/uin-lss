import Vue from 'vue'
import App from './App'
import store from './store'
import config from '@/common/config'
import wLoading from "@/components/loading/w-loading";
import inputs from '@/components/QuShe-inputs/inputs.vue';
import {
	unifyAjax,
	md5Ajax,
	gotoPage,
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal,
	accessLogin
} from '@/utils'

import {
	$$set,
	$$get
}
from '@/common/global';


Vue.component('inputs', inputs);
Vue.component('w-loading', wLoading)

Vue.config.productionTip = false

Vue.prototype.$store = store;
Vue.prototype.$api = {
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal,
	gotoPage,
	accessLogin,
	/**
	 * 检测是否已经登录
	 *  hint  是否提示
	 * isBack 是否回退
	 * backUrl 如果是新注册，返回的url，给固码使用
	 */
	hasLogin({ hint = false, isBack = "", backUrl = "" } = {}) {
		if ($$get.login('taccountid')) {
			return true
		}
		if (hint) {
			showModal({
				content: `亲,您还没有注册/登录哦！`,
				confirmText: "确定",
				success(res) {
					if (res.confirm) {
						console.log('1111111111111111111')
					//	util.gotoPage(`/common/login/login?pageType=user&isBack=${isBack}&backUrl=${backUrl}`)
					}
				}
			})
		}
		return false
	},
	imgDomain: config.imgDomain,
	refresh(callback) {
		callback(() => {
			uni.showNavigationBarLoading()
		}, () => {
			uni.stopPullDownRefresh();
			uni.hideNavigationBarLoading()
		})
	}
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
