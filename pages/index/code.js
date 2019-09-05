import * as util from '@/utils';
import {
	$$set,
	$$get
} from '@/common/global';

/**
 * 解析二维码
 */
export default function(options) {

	//固码支付
	// $$set.share({
	// 	fagentid: "708000719740", //推荐id
	// 	type: "qrPay"
	// })

	// 分享转发
	// $$set.share({
	// 	fagentid: "708000719740", //推荐id
	// 	agentidsp: "708000722290", //商家id
	// 	goodsid: "102", //商品id
	// 	type: "register"
	// })

	console.log('index options', options)

	// 通过转发注册
	//"?fagentid=708000719740&agentidsp=1111111111&goodsid=222222"
	if (!util.isEmpty(options.fagentid) &&
		!util.isEmpty(options.agentidsp) &&
		!util.isEmpty(options.goodsid)) {
		$$set.share({
			fagentid: options.fagentid, //推荐id
			agentidsp: options.agentidsp, //商家id
			goodsid: options.goodsid, //商品id
			type: "goods"
		})
	}

	//通过扫描二维码
	var scene = decodeURIComponent(options.scene);
	if (!util.isEmpty(scene)) {
		let sceneData = scene.split("-");
		let tickName = sceneData[0]

		//固码支付 pay-708000719740
		if (tickName == 'pay') {
			$$set.share({
				fagentid: sceneData[1],
				type: "qrPay"
			})
		}

		//海报推广 zc-708000719740
		if (tickName == 'zc') {
			$$set.share({
				fagentid: sceneData[1],
				type: "register"
			})
		}

		//sp-fagentid-agentidsp-goodsid
		//sp-2222222-111111-33333
		if (tickName == 'sp') {
			$$set.share({
				fagentid: sceneData[1], //推荐id
				agentidsp: sceneData[2], //商家id
				goodsid: sceneData[3], //商品id
				type: "goods"
			})
		}
	}

	//保存下次注册状态
	// if (app.globalData.share.fagentid) {
	// 	//这2种模式下，保留下次进来的注册记录
	// 	if (app.globalData.share.type === "goods" || app.globalData.share.type === "register") {
	// 		util.setStorage('fagentid', app.globalData.share.fagentid)
	// 	}
	// }

}
