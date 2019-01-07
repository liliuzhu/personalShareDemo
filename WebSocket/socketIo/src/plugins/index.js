import socketClient from './socketClient'
const install = (Vue) => {
  if (install.installed) {
    return
  }
  socketClient(Vue)
}
export default {
  install
}
