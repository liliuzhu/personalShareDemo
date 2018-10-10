<template>
  <div class="list-item">
    <div class="flex_content">
      <div class="car_info_left">
        <div class="image_box">
          <img class="item_image" v-if="orderInfo.car_show_image" v-lazy.car-owner-servece-list="orderInfo.car_show_image">
          <img class="item_image" v-else :src="staticImag">
        </div>
      </div>
      <div class="car_info_right">
        <strong class="car_model">{{orderInfo.car_title}}</strong>
        <div class="price">{{orderInfo.car_sell_price}}</div>
      </div>
    </div>
    <!--<div class="order_info">
      <a class="goods_name" :href="lookDetail(orderInfo.goods_id)">{{orderInfo.goods_name}}车主服务费</a>
      <span class="origin_price"><span style="font-family: PingFangSC-Regular">¥</span>{{orderInfo.goods_price / 100 | amount}}</span>
      <button v-if="canPay" class="status_btn btn-primary" @click="payOrder">付款</button>
      <span v-else-if="paid" class="status_btn tag-default">已付款</span>
      <span v-else class="status_btn tag-default">支付中</span>
    </div>-->
    <div class="grail_container">
      <div class="left_name">
        <a class="goods_name" :href="lookDetail(orderInfo.goods_id)">{{orderInfo.goods_name}}车主服务费</a>
      </div>
      <div class="right_btn">
        <button v-if="canPay" class="status_btn btn-primary" @click="payOrder">付款</button>
        <span v-else-if="paid" class="status_btn tag-default">已付款</span>
        <span v-else class="status_btn tag-default">支付中</span>
      </div>
      <div class="center_price">
        <span class="origin_price"><span style="font-family: PingFangSC-Regular">¥</span>{{orderInfo.goods_price / 100 | amount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchBusinessOrderId } from '../../service/order.service'
// import { eventBus } from '@/eventBus'
import defaultImage from './car_image_@3x.png'

export default {
  name: 'list-item',
  data() {
    return {
      // payPending: false,
      businessOrderInfo: null,
      staticImag: defaultImage
    }
  },
  props: {
    orderInfo: {
      type: Object,
      required: true
    },
    ucid: {
      type: [String, Number],
      required: true
    }
  },
  mounted () {
    // eventBus.$on('pay-status', (appMessage) => {
    //   let { status } = appMessage
    //   status = status === 1 ? 1 : 5
    //   this.payCallback({ ...this.businessOrderInfo, status })
    // })
  },
  methods: {
    async payOrder() {
      // if (this.payPending) return
      // 先掉后端api 创建财务订单
      const orderInfo = {
        order_id: this.orderInfo.order_id,
        goods_id: this.orderInfo.goods_id,
        car_id: this.orderInfo.car_id,
        ucid: this.ucid,
        source: '10023'
      }
      const encrypted = this.$rrcBridge.handleRequestAppApi('encrypt', orderInfo)
      const needDecrypt = await fetchBusinessOrderId({ param: encrypted })
      if (needDecrypt && Number(needDecrypt.status) === 0) {
        this.businessOrderInfo = this.$rrcBridge.handleRequestAppApi('decrypt', needDecrypt.data)
        this.payInApp(this.businessOrderInfo)
        this.$emit('updateOrderInfo', this.businessOrderInfo)
      } else {
        this.$emit('updateOrderInfo', null)
      }
    },
    async payInApp(data) {
      // 拉起app支付
      if (this.$rrcBridge) {
        // this.payPending = true
        await this.$rrcBridge.handleRequestAppApi('payOrder', {
          order_id: data.order_id,
          creator_id: data.user_id,
          business_order_id: data.business_order_id,
          pos_data: data.pos_data
        })
      }
    },
    lookDetail(goodId) {
      let goodDetailUrl = ''
      switch (goodId) {
        case '9f84ce0baf0648a4b6cf96ec75292ad9' : // 好车资质认证
          goodDetailUrl = 'http://img1.rrcimg.com/haocherenzhengtaocan.htm'
          break
        case '36868715a3f6445b9e88a7fa35da22bb' : // C端 速卖服务
          goodDetailUrl = 'http://img1.rrcimg.com/sumaifuwu.htm'
          break
        case '4c09c3e8dbcc4fdcae4fbff6fa204d10' : // B端 准入套餐
          goodDetailUrl = 'http://img1.rrcimg.com/zhunruzige.htm'
          break
        case '36c9dbc7aeae4485a0863df41ffbe1e8' : // b端速卖宝
          goodDetailUrl = 'http://img1.rrcimg.com/shangmensumai.htm'
          break
        default:
          goodDetailUrl = 'http://img1.rrcimg.com/sumaifuwu.htm'
          break
      }
      return goodDetailUrl
      // window.location.href = goodDetailUrl
    }
    // async payCallback({ order_id, business_order_id, goods_id, car_id, status }) { // eslint-disable-line
    //   const params = {
    //     order_id,
    //     status,
    //     business_order_id,
    //     goods_id,
    //     car_id
    //   }
    //   const encrypted = this.$rrcBridge.handleRequestAppApi('encrypt', params)
    //   await getAppCallbackUpdate({ param: encrypted })
    //   this.payPending = false
    //   this.$parent.$parent.refresh()
    // }
  },
  computed: {
    canPay() {
      return this.orderInfo.order_status === 0 ||
        this.orderInfo.order_status === 4 ||
        this.orderInfo.order_status === 5
    },
    paid() {
      return this.orderInfo.order_status === 2 ||
        this.orderInfo.order_status === 3
    }
  },
  filters: {
    amount (val) {
      val = val.toString().replace(/\$|\\,/g, '')
      if (isNaN(val)) {
        val = '0'
      }
      let sign = val === (val = Math.abs(val) + '')
      val = Math.floor(val * 100 + 0.50000000001)
      let cents = val % 100
      val = Math.floor(val / 100).toString()
      if (cents < 10) {
        cents = '0' + cents
      }
      for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
      }

      return (((sign) ? '' : '-') + val + '.' + cents)
    }
  }
}
</script>

<style lang="scss">
  @import 'scss/mixins/mixin';
  $primary: #FFA14D;
  $default: #74B362;
  .list-item {
    background-color: #fff;
    padding: 0.33rem 0.33rem 0 0.33rem;
    margin-bottom: 0.2rem;
    .flex_content {
      @include flex_box();
      padding-bottom: 0.2rem;
      border-bottom: dashed 0.03rem rgba(0,0,0,0.07);
    }
    .car_info_left{
      width: 40%;
      @include flex_num(2);
      .image_box{
        position: relative;
        padding-bottom: 66%;
      }
      .item_image{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #F7F7F7 no-repeat center center;
      }
      .item_image[lazy=loading ] {
        @include bg_image('./car_image_');
        background-size: contain;
      }
    }
    .car_info_right{
      @include flex_box();
      width: 60%;
      @include flex_num(3);
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.333333rem;
      font-size: 0.42rem;
    }
    .car_model{
      display: block;
      line-height: 1.3;
      font-weight: 500;
      @include ext-overflow(2);
      height: 1.3* 2em;
      word-break: break-word;
    }
    .price{
      line-height: 1.5;
      padding-top: 0.15rem;
      color: rgba(0, 0, 0, 0.5);
    }
    .grail_container{
      font-size: 0;
      overflow: hidden;
      padding: 0.36rem 0;
      white-space: nowrap;
      .left_name{
        float: left;
        font-size: 0.43rem;
        width: 40%;
        min-width: 9.2em;
      }
      .right_btn{
        float: right;
        width: 20%;
        min-width: 1.5rem;;
        text-align: right;
      }
      .center_price{
        overflow: hidden;
        padding-left: 0.3rem;
      }
    }
    /*.order_info{
      @include flex_box();
      align-items: center;
      justify-content: space-between;
      padding: 0.36rem 0;
      white-space: nowrap;
    }*/
    .goods_name{
      font-size: 0.43rem;
      color: inherit;
      @include ext-overflow(1);
      &:focus,&:hover,&:active,&:visited{
        text-decoration: none;
      }
      &:active{
        color: #888;
      }
    }
    .origin_price{
      font-size: 0.5rem;
      color: $primary;
    }
    .status_btn{
      width: 1.5rem;
      line-height: 1.75;
      border-radius: 0.05rem;
      text-align: center;
      font-size: 0.3rem;
      padding: 0.03rem;
      display: inline-block;
    }
    .btn-primary{
      border: 0.015rem solid $primary;
      background-color: $primary;
      color: #fff;
    }
    .tag-default{
      background-color: rgba(0,0,0,0.03);
      color: rgba(0,0,0,0.36);
    }
  }
</style>
