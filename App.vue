<script>
	export default {
		globalData: {
			version: '1.0.8',

			//微信认证
			device: {
				agentid: '', //商户ID
				openid: '', //注册最后一步需要，用来判断登录
				code: '', //登录凭证
				//zheng
				appid: 'wx3ae92fa03906e0f7',
				secret: ''
			},

			//二维码相关
			qrPay: {
				agentname: '', //商家名
				launch: false, //固码支付
				router: {
					switchTab: '/pages/tabbar/homepage/homepage' //回退地址，根据用户已经登录的平台评断
				}
			},

			/**
			 * 通过分享获取的数据接口
			 */
			share: {
				posterImageUrls: [], //海报分享图
				prize_pz_id: '', //
				fagentid: '' //推荐，商户，用户都需要, 通过二维码转发 获取
			},

			//获取用户信息
			userInfo: {},

			//定位坐标信息
			location: {
				latitude: '',
				longitude: ''
			},

			// 临时数据传递
			temp: {},

			//============
			//  登录信息
			//============
			login: {
				istg: '', //权限
				platform: '', //登录类型 user用户  merchant商铺
				faceId: '', //faceid
				vernum: '',
				latitude: '',
				longitude: '',
				randnum: '',
				compaddress: '',
				// agentname: "", //商铺名
				taccountid: '', //商铺id 708000719740 7080007
				mobileno: '', //注册电话
				facename: '', //法人姓名
				is_volume: '',
				referral_code: ''
			}
		},
		
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

<style>
	/*每个页面公共css */
</style>
