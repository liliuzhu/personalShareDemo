<template>
  <rc-page :title="'车主服务'">
    <no-data v-if="list && list.length <=0 " />
    <ul v-else-if="list && list.length > 0" id="car-owner-servece-list" class="car_owner_service_list scrolling">
      <li v-for="(item, index) in list" :ucid="ucid" :key="index">
        <list-item @updateOrderInfo="updateOrderInfo" :orderInfo="item"/>
      </li>
    </ul>
  </rc-page>
</template>

<script>
import listItem from './components/list.item'
import noData from './components/nodata'
import {searchOrderList, getAppCallbackUpdate} from '../service/order.service'
import { eventBus } from '@/eventBus'
export default {
  data() {
    return {
      list: null,
      ucid: null,
      currentOrderInfo: {}
    }
  },
  created() {
    eventBus.$on('pay-status', this.payCallback)
    this.getUserUcid()
  },
  beforeDestroy() {
    eventBus.$off('pay-status', this.payCallback)
  },
  methods: {
    async refresh() {
      const encrypted = this.$rrcBridge.handleRequestAppApi('encrypt', this.ucid)
      const { data } = await searchOrderList({ param: encrypted })
      if (data) {
        const decrypt = this.$rrcBridge.handleRequestAppApi('decrypt', data)
        this.list = decrypt && decrypt.order_list ? decrypt.order_list : []
      } else {
        this.list = []
      }
    },
    getUserUcid() { // 获取登录人ucid
      const result = this.$rrcBridge.handleRequestAppApi('getBasicUserInfo', '') || '{}'
      let userInfo = JSON.parse(result)
      if (Number(userInfo.code) === 0 && userInfo.getBasicUserInfo) {
        this.ucid = userInfo.getBasicUserInfo // 993414046113861632 静态值
        this.refresh()
      } else {
        this.$MessageBox.alert('当前用户的信息获取失败')
      }
    },
    async payCallback(appMessage) {
      let {status} = appMessage
      status = status === 1 ? 1 : 5
      let {order_id, business_order_id, goods_id, car_id} = this.currentOrderInfo || {} // eslint-disable-line
      const params = {
        order_id,
        status,
        business_order_id,
        goods_id,
        car_id
      }
      const encrypted = this.$rrcBridge.handleRequestAppApi('encrypt', params)
      await getAppCallbackUpdate({ param: encrypted })
      this.refresh()
    },
    updateOrderInfo(currentOrderInfo) {
      this.currentOrderInfo = currentOrderInfo
    }
  },
  components: {
    listItem,
    noData
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .car_owner_service_list{
    height: 100%;
  }
</style>
