import Vue from 'vue'
import App from './App'
import store from './store'
import config from '@/common/config'
import wLoading from "@/components/loading/w-loading";
import {
	gotoPage,
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal,
	accessLogin
} from '@/utils'


//全局注入w-loading组件
Vue.component('w-loading',wLoading)

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
	imgDomain:config.imgDomain,
	refresh(callback){
		callback(()=>{
			uni.showNavigationBarLoading()
		},()=>{
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
