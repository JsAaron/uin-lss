import * as util from '@/utils';
import {
	$$set,
	$$get
} from '@/common/global';

export default function(options) {
	return new Promise((reslove, reject) => {
		uni.login({
			provider: 'weixin',
			success: loginRes => {
				if (!loginRes.code) {
					util.showToast('登录失败！' + loginRes.errMsg);
					return reject();
				}
				$$set.code(loginRes.code);
				util
					.getWxOpenId({
						appid: $$get.appid(),
						code: loginRes.code
					})
					.then(openRes => {
						//获取openid
						const openid = openRes.data.openid;
						if (openid) {
							$$set.openid(openid);
							reslove();
						} else {
							util.showToast('没有获取设备编号,请再次点击');
							return;
						}
					})
					.catch(err => {
						util.showToast('服务器连接失败');
						reject();
					});
			},
			fail() {
				util.showToast(' 获取微信登录凭证失败');
				reject();
			}
		});
	});
}
