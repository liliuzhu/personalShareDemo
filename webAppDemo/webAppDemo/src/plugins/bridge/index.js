import Bridge from './bridge'

export default {
  install(Vue) {
    const bridge = new Bridge()
    Vue.$rrcBridge = bridge
    Vue.mixin({
      created() {
        this.$rrcBridge = bridge
      }
    })
  }
}
