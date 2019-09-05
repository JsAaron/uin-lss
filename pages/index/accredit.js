import * as util from '@/utils';
import { $$set, $$get } from '@/common/global';

/**
 * 检测用户权限，设置数据
 * 获取微信用户基本信息
 */
export function accreditUserInfo(success, fail) {
	util
		.checkAccredit('scope.userInfo')
		.then(() => {
			util.getUserInfo().then(data => {
				success(data);
			});
		})
		.catch(fail);
}

/**
 * 检测用户定位
 */
export function accreditUserLocation(success, fail) {
	util
		.detectAccredit('scope.userLocation')
		.then(success)
		.catch(() => {
			let data = {
				content: '您未选择地理位置，我们无法为您提供服务！',
				scope: 'scope.userLocation',
				buttonText: '重新获取地理位置',
				describe: '亲，我们未获得您的位置授权，将无法为您提供推荐的商圈以及相关的一些活动！'
			};
			util.gotoPage(`/pages/common/accredit/accredit?data=${JSON.stringify(data)}`);
			fail && fail();
		});
}

/**
 * 获取坐标位置
 */
export function getLocation(callback) {
	util.getLocationData().then(res => {
		$$set.location(res.latitude,res.longitude)
		// app.globalData.location.latitude = res.latitude;
		// app.globalData.location.longitude = res.longitude;
		callback && callback();
	});
}