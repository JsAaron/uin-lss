/*
 * @Author: Aaron
 * @Date: 2019-08-11 11:49:22
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-27 22:22:25
 * @Description: 
 */
function simulate() {

  const common = {
    "goods": "/common/goods/goods",
    "settings": "/common/settings/settings",
    "search": "/common/search/search",

    // 注册
    "merchant-login": "/common/login/login?pageType=merchant",
    "user-login": "/common/login/login?pageType=user",
    // 人脸
    face: "/common/face-pay/face-pay",
    //新增银行卡
    "add-bank-card": "/common/add-bank-card/add-bank-card",
    // 绑定快捷
    success: "/common/success/success",
    "fast-pay": "/common/fast-pay/fast-pay",
    // 红包
    "red-envelope-send": "/common/red-envelope/send/send",
    "red-envelope-details": "/common/red-envelope/details/details",
    "red-envelope-business": "/common/red-envelope/business/business",
    // 密码
    "change-password": "/common/safety-center/change-password/change-password",
    "reset-password": "/common/safety-center/reset-password/reset-password",
    //一分分享
    "share-schedule": "/common/share-schedule/share-schedule"
  };

  // return common["goods"]

	//用户端
  const userUrls = {
    "home": "/pages/tabbar/home/home",
    "product": "/pages/tabbar/product/product",
  }

  return userUrls["product"]


  //==============
  // 商户端
  //==============
  const merchantUrls = {
    // 首页
    "homepage": "/pages/merchant/pages/homepage/homepage",
    "settings": "/pages/merchant/pages/settings/settings",
    "commodity": "/pages/merchant/pages/commodity/commodity",
    "commodity-add": "/pages/merchant/pages/commodity/add/add",
    "commodity-modify": "/pages/merchant/pages/commodity/modify/modify",
    "commodity-discount": "/pages/merchant/pages/commodity/discount/discount",
    "shop": "/pages/merchant/pages/shop/shop",


    device: "/pages/merchant/pages/device/device",
    deviceAdvert: "/pages/merchant/pages/device/advert/advert",
    payment: "/pages/merchant/pages/payment/payment",
    paymentCode: "/pages/merchant/pages/payment-code/payment-code",
    order: "/pages/merchant/pages/order/order"
  };
  // return merchantUrls["commodity-add"]


  const subpackageUrl = {
    // 注册商户,我要开店
    "shop-info": "/pages/subpackage/setup-shop/shop-info/shop-info",
    certification: "/pages/subpackage/setup-shop/certification/certification",
    protocol: "/pages/subpackage/setup-shop/protocol/protocol",
    settlement: "/pages/subpackage/setup-shop/settlement/settlement",

    "service-for": "/pages/subpackage/service-provider/apply-for/apply-for",
    "service-protocol": "/pages/subpackage/service-provider/apply-protocol/apply-protocol",
    "service-order": "/pages/subpackage/service-provider/apply-order/apply-order",
    "service-pay": "/pages/subpackage/service-provider/apply-pay/apply-pay",
    "service-data": "/pages/subpackage/service-provider/apply-data/apply-data",
    "service-settlement": "/pages/subpackage/service-provider/apply-settlement/apply-settlement",

  }

  // return subpackageUrl["service-data"]

}

module.exports = simulate;