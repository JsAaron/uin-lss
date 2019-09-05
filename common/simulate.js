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


  const userUrls = {
    //bar
    "home": "/pages/tabbar/home/home",
    "recommend": "/pages/tabbar/recommend/recommend",
    "my": "/pages/tabbar/my/my",

    // 注册
    order: "/pages/user/pages/my/order/order",
    face: "/pages/user/pages/register/face/face",
    paypwd: "/pages/user/pages/register/paypwd/paypwd",

    //首页
    "homepage-discount": "/pages/user/pages/homepage/discount/discount",
    "homepage-shop": "/pages/user/pages/homepage/shop/shop",
    "homepage-details": "/pages/user/pages/homepage/details/details",

    //个人中心
    "my-wallet": "/pages/user/pages/my-wallet/my-wallet",
    "my-wallet-details": "/pages/user/pages/my-wallet/details/details",
    "my-withdraw-cash": "/pages/user/pages/my-wallet/withdraw-cash/withdraw-cash",

    "my-team": "/pages/user/pages/my/team/team",
    "my-partner": "/pages/user/pages/my/partner/partner",
    "my-partner-order": "/pages/user/pages/my/partner/order/order",
    "my-partner-pay": "/pages/user/pages/my/partner/pay/pay",

    "my-share": "/pages/user/pages/my/share/share",
    "my-share-operate": "/pages/user/pages/my/share/operate/operate",
    "my-share-money": "/pages/user/pages/my/share/money/money",
    "my-share-copywriter": "/pages/user/pages/my/share/copywriter/copywriter",

    "my-client": "/pages/user/pages/my/client/client",
    "my-referrer": "/pages/user/pages/my/referrer/referrer",
    "my-certification": "/pages/user/pages/my/certification/certification",

    "my-issue": "/pages/user/pages/my/issue/issue",
    "my-rule": "/pages/user/pages/my/rule/rule",
    "my-service": "/pages/user/pages/my/service/service",

    "my-poster": "/pages/user/pages/my/poster/poster"

  }

  return userUrls["home"]


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