import Vue from 'vue'
import App from './App'
import {
	showBusy,
	hideBusy,
	showToast,
	hideToast
} from '@/utils/common'

Vue.config.productionTip = false

Vue.prototype.$api = {
	showBusy,
	hideBusy,
	showToast,
	hideToast
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
