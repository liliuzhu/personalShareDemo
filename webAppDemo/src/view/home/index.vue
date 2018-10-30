<template>
  <div class="content">
    <mt-button type="primary" @click="getAndroidEquipmentPower">使用JSInterface获取设备电量</mt-button>
    <mt-button type="danger" @click="getAndroidEquipmentSN">使用JSBridge获取设备电量</mt-button>
    <mt-button type="danger" @click="closeApp">关闭App</mt-button>
    <mt-button type="danger" @click="AppScheme">AppScheme</mt-button>
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
    // eventBus.$on('pay-status', this.payCallback)
    // this.$router.replace({path: '/car-owner-service'})
  },
  beforeDestroy() {
    // eventBus.$off('pay-status', this.payCallback)
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
        alert(JSON.stringify(result))
      })
    },
    async payCallback(appMessage) {
      this.$messagebox.alert(JSON.stringify(appMessage))
    }
  }
}
</script>
<style lang="scss">
  .content{
    padding: 1rem;
    text-align: center;
  }
</style>
