import {device} from '@/util'
import l from '@/assets/img/l.gif'
export default {
  methods: {
    updateTitle (title, img = l) {
      this.$doc = document
      if (title === undefined || this.$doc.title === title) {
        return
      }
      this.$doc.title = title
      if (device.isIOS()) {
        let iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.setAttribute('src', img || '/favicon.ico')
        let iframeCallback = () => {
          setTimeout(() => {
            iframe.removeEventListener('load', iframeCallback)
            document.body.removeChild(iframe)
          }, 0)
        }
        iframe.addEventListener('load', iframeCallback)
        document.body.appendChild(iframe)
      }
    }
  }
}
