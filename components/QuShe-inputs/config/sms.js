import * as util from '@/utils';
/**
 * 发送验证码方法
 * @param {any} customId
 * @param {String} phone
 */
export default function sendSMS(customId, phone) { // 发送验证码方法, 需返回生成的验证码
	return new Promise(function(reslove, reject) {
		uni.showToast({
			title: `发送验证码给${phone}成功,请注意查收`,
			icon: 'none',
			duration: 2000
		});
		// 增加银行卡绑定
		if (customId === 'add-back-card') {
			util.getPhoneCode({
				funcode: "0003",
				mobileno: phone,
				vertype: "3"
			}).then(response => {
				//保存随机码，需要一并提交
				reslove(response.data.randnum)
			}).catch(retMsg => {
				//获取失败处理
				util.showToast(retMsg)
			})
		}
		//重设密码
		if (customId === 'reset-password') {
			//发送验证码
			util.getPhoneCode({
				funcode: "0003",
				mobileno: phone,
				vertype: "2"
			}).then(response => {
				reslove(response.data.randnum)
			}).catch(retMsg => {
				//获取失败处理
				util.showToast(retMsg)
			});
		}
	})
}
