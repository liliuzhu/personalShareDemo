import {
  Indicator,
  MessageBox,
  Lazyload,
  Button
} from 'mint-ui'

let components = [Button]
let directives = [Lazyload]
const install = function (Vue, _opts = {}) {
  if (install.installed) return

  components.map(component => {
    Vue.component(component.name, component)
  })
  directives.map(directive => {
    Vue.use(directive)
  })

  Vue.$Indicator = Vue.prototype.$Indicator = Indicator
  Vue.$MessageBox = Vue.prototype.$MessageBox = MessageBox
}

export default {
  install
}
