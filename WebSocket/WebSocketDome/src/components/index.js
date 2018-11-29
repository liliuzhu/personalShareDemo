// import Lazyload from 'vue-lazyload'

// import createAPI from '@/helpers/create.api'
// import Base from './base.vue'
// import Button from './button'
// import PageLoading from './page.loading'
// import Loading from './loading'
import Page from './page'
// import Header from './header'
// import Content from './content'
// import Popup from './popup'
// import Dialog from './dialog'
// import Toast from './toast'
// import Card from './card'
// import CardContent from './card.content'
// import CardHeader from './card.header'
// import CardItem from './card.item'
// import CardFooter from './card.footer'
// import CardInput from './card.input'
// import Empty from './empty'
// import Checkbox from './checkbox'

// import ClickOutside from './click.outside'

const components = [
  // Base,
  // Button,
  // Tip,
  // Toast,
  // Dialog,
  // Loading,
  // PageLoading,
  Page
  // Header,
  // Content,
  // Popup,
  // Card,
  // CardContent,
  // CardHeader,
  // CardItem,
  // CardFooter,
  // CardInput,
  // Empty,
  // Checkbox
]

const install = (Vue) => {
  if (install.installed) {
    return
  }

  components.forEach(component => {
    // 项目时间关系 先用这 滴滴的库 之后写自己的
    Vue.component(component.name.replace(/^cube-/i, 'rc-'), component)
  })

  // createAPI 在Vue实例上挂载$rrcTOAST,$rrcDialog,$rrcPOPUP等方法
  // createAPI(Vue, Toast, [], false)
  // createAPI(Vue, Dialog, ['confirm', 'cancel', 'close', 'btn-click', 'link-click'], true)
  // createAPI(Vue, Popup, ['mask-click'], true)

  // Vue.use(ClickOutside)
  // Vue.use(Lazyload)

  const EventBus = new Vue()
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get() {
        return EventBus
      }
    }
  })

  Vue.$$loadingImgSrc = Vue.prototype.$$loadingImgSrc = ''
}
export default {
  install
}
