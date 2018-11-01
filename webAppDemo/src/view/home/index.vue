<template>
  <div class="content">
    <ul>
      <li><mt-button type="primary" @click="getAndroidEquipmentPower">使用JSInterface获取设备电量</mt-button></li>
      <li><mt-button type="danger" @click="getAndroidEquipmentSN">使用JSBridge获取设备电量</mt-button></li>
      <li><mt-button type="primary" @click="AppScheme">AppScheme-JSBridge方式</mt-button></li>
      <li><mt-button type="danger" @click="closeApp">关闭App</mt-button></li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
// import { eventBus } from '@/eventBus'
export default {
  name: 'home',
  data() {
    return {}
  },
  created() {
    this.$bus.$on('button1', this.payCallback1)
    this.$bus.$on('button2', this.callback2)
    // this.$router.replace({path: '/car-owner-service'})
  },
  beforeDestroy() {
    this.$bus.$off('button1', this.payCallback1)
    this.$bus.$off('button2', this.callback2)
  },
  methods: {
    getAndroidEquipmentPower() {
      if (window.JSInterface) {
        let powerNum = window.JSInterface.getAndroidEquipmentPower()
        window.JSInterface.AndroidToastMessage(`当前设备电量:${powerNum}`)
      }
    },
    getAndroidEquipmentSN() {
      if (window.JSInterface) {
        let SN = window.JSInterface.getAndroidEquipmentSN()
        window.JSInterface.AndroidToastMessage(`当前设备号:${SN}`)
      }
    },
    closeApp() {
      if (window.JSInterface) {
        window.JSInterface.AndroidCloseApp()
      }
    },
    AppScheme() {
      let params = {name: '张三', age: 24}
      this.$rrcBridge.asyncRequestAppApi('encryptPay', params, result => {
        // alert(JSON.stringify(result))
      })
    },
    payCallback1(appMessage) {
      alert(appMessage.message)
    },
    callback2(appMessage) {
      alert(appMessage.message)
    }
  }
}
</script>
<style lang="scss">
  .content{
    padding: 1rem;
    text-align: center;
    li{
      padding: 0.3rem 0;
    }
  }
</style>
