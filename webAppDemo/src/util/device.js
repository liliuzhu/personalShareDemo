export default class Device {
  constructor (ua = window.navigator.userAgent.toLowerCase()) {
    this.ua = ua
  }

  /*
   * 获取操作系统
   * @returns { name: '', version: '' }
   */
  getOS () {
    let name, version
    const osMap = {
      'Mac OS': /(mac\sos\sx)\s?([\w\s\.]+\w)*/i, // eslint-disable-line
      'Windows': /windows\s*nt\s*([0-9.]+)/
    }

    const winVersion = {
      '5.0': '2000',
      '5.1': 'XP',
      '5.2': '2003',
      '6.0': 'Vista',
      '6.1': '7',
      '6.2': '8',
      '6.3': '8.1',
      '6.4': '10',
      '10': '10'
    }

    let matchs = Object.keys(osMap).filter((osName) => {
      return osMap[osName].test(this.ua)
    })

    name = matchs.length > 0 ? matchs[0] : 'unknow'

    switch (name) {
      case 'Mac OS':
        version = osMap[name].exec(this.ua)[2] ? osMap[name].exec(this.ua)[2].replace(/_/g, '.') : 'unknow'
        break
      case 'Windows':
        version = osMap[name].exec(this.ua)[1] ? winVersion[osMap[name].exec(this.ua)[1]] : 'unknow'
        break
      default:
        version = 'unknow'
    }

    return {
      name: name,
      version: version
    }
  }

  /*
   * 获取浏览器
   * @returns { name: '', version: '' }
   */
  getBrowser () {
    let name, version
    const browserMap = {
      WeChat: /micromessenger\/(\d+\.\d+\.\d+)/i,
      Chrome: /chrome\/(\d+\.\d+\.\d+)/i,
      Firefox: /firefox\/(\d+\.\d+\.\d+)/i,
      Safari: /(?:iphone|ipad|mac os).*safari\/(\d+\.\d+\.\d+)?/i
    }

    let matchs = Object.keys(browserMap).filter((browserName) => {
      return browserMap[browserName].test(this.ua)
    })

    name = matchs.length > 0 ? matchs[0] : 'unknow'
    version = name !== 'unknow' && browserMap[name].exec(this.ua)[1] ? browserMap[name].exec(this.ua)[1] : 'unknow'
    return {
      name: name,
      version: version
    }
  }

  /*
   * 是否为微信
   * @return Boolean
   */
  isWeixin () {
    return /micromessenger/i.test(this.ua)
  }

  /*
   * 是否为UC
   * @return Boolean
   */
  isUc () {
    return /ucbrowser/i.test(this.ua)
  }

  /*
   * 是否为QQ浏览器
   * @return Boolean
   */
  isQQ () {
    return /mqqbrowser/i.test(this.ua)
  }

  /*
   * 是否为安卓系统
   * @return Boolean
   */
  isAnroid () {
    return /(android)/i.test(this.ua)
  }

  /*
   * 是否为ios系统
   * @return Boolean
   */
  isIOS () {
    return /(iphone|ipad|ipod|ios)/i.test(this.ua)
  }
}
