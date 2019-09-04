import Vue from 'vue'
import App from './App'
import store from './store'
import {
	gotoPage,
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal,
	accessLogin
} from '@/utils'

Vue.config.productionTip = false

Vue.prototype.$store = store;
Vue.prototype.$api = {
	showBusy,
	hideBusy,
	showToast, 
	hideToast,
	showModal,
	gotoPage,
	accessLogin
}


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
