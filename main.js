import Vue from 'vue'
import App from './App'
import {
	gotoPage,
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal
} from '@/utils/common'

Vue.config.productionTip = false

Vue.prototype.$api = {
	showBusy,
	hideBusy,
	showToast,
	hideToast,
	showModal,
	gotoPage
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
