const install = (Vue) => {
  if (install.installed) {
    return
  }
  const EventBus = new Vue()
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get() {
        return EventBus
      }
    }
  })
}
export default {
  install
}
