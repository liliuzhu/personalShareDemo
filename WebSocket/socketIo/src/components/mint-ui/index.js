import {
  Indicator,
  MessageBox,
  Lazyload,
  Popup,
  Button,
  Cell,
  Toast
} from 'mint-ui'

let components = [Popup, Button, Cell]
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
  Vue.$Toast = Vue.prototype.$Toast = Toast
}

export default {
  install
}
