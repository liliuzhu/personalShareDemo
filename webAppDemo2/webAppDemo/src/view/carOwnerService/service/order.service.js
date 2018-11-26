import {get, post} from 'http_config'

/**
 * 通过ucid查询车主订单列表
 * @param {string} ucid
 */
export function searchOrderList(param) {
  // return get('v1/service_charge/charge_order_list/', param)
  return get('service_charge/v1/charge_order_list', param)
}

/**
 * 获取支付中心订单号
 * @param {string} param.order_id 订单id
 * @param {in t} param.car_id 车辆id
 * @param {string} param.ucid 用户中心id
 * @param {string} param.source 订单来源
 */
export function fetchBusinessOrderId(param) {
  // return post(`v1/service_charge_order/pre_pay_order`, param)
  return post(`service_charge/v1/order/pre_pay_order`, param)
}

/**
 * 订单支付完成APP回调
 * @param {string} param.order_id 订单id
 * @param {string} param.status 订单状态
 * @param {string} param.business_order_id 支付中心唯一单号
 * @param {string} param.goods_id
 * @param {string} param.car_id
 */
export function getAppCallbackUpdate(param) {
  // return post('/v1/service_charge_order_callback', param)
  return post('service_charge/v1/order_callback', param)
}
