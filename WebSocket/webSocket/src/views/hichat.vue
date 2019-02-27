<template>
  <rc-page title="聊天室">
    <div class="wrapper">
      <div class="banner">
        <h1 class="banner_title">供应链前端周会！<span v-show="logged"> -- {{nickName}}</span></h1>
        <span class="online_count">{{userCount}}</span>
      </div>
      <div class="historyMsg" ref="historyMsgBox">
        <div v-for="(item,index) in historyList" class="msg_item" :class="{my_self: item.user === nickName}" :key="index" :style="{color: item.color}">
          <p class="timespan">({{item.date}})</p>
          <span class="nick_name" v-if="item.user !== nickName">【{{item.user}}】：</span>
          <p class="msg_content" v-if="item.type==='msg'" v-html="_analysisEmoji(item.msg)"></p>
          <p class="msg_content" v-else-if="item.type==='img'"><a :href="item.msg" target="_blank"><img :src="item.msg"/></a></p>
          <span class="nick_name" v-if="item.user === nickName">：【{{item.user}}】</span>
        </div>
      </div>
      <div class="controls">
        <div class="items">
          <input class="colorStyle" type="color" v-model="textColor" title="文本颜色"/>
          <button title="表情" @click.stop="showEmojiWrapper=!showEmojiWrapper">表情</button>
          <label for="sendImage" class="imageLable">
            <button>图片</button>
            <input id="sendImage" @change="changeImage($event)" type="file" value="图片"/>
          </label>
          <button title="清空屏幕">清空</button>
          <div class="emojiWrapper" v-show="showEmojiWrapper">
            <div class="emoji_box" ref="emojiBox">
              <img class="emoji" @click="selectEmoji(index)" v-for="index in totalEmojiNum" :key="index" :src="'/static/emoji/'+index+'.gif'" :alt="index" :title="index"/>
            </div>
          </div>
        </div>
        <div class="text_edit_control">
          <textarea class="messageInput" ref="messageInput" v-model.trim="messageInput" placeholder="请输入" @keyup.enter="sendMsg"></textarea>
          <button class="sendBtn" @click="sendMsg">发送</button>
        </div>
      </div>
    </div>
    <div class="loginWrapper" v-if="!connected || !logged">
      <p v-show="tipInfo">{{tipInfo}}</p>
      <div class="nickWrapper" v-if="connected && !logged">
        <input type="text" placeHolder="请输入账号" v-model="nickName" @keyup.enter="login" class="nicknameInput" ref="nicknameInput"/><input type="button" value="登录"  @click="login"/>
      </div>
    </div>
    <chat-audio ref="chatAudio"></chat-audio>
  </rc-page>
</template>

<script>
import chatAudio from './chatAudio'
export default {
  name: 'HelloWorld',
  data () {
    return {
      connected: false,
      logged: false,
      events: ['connect', 'reconnect', 'disconnect', 'postMsg', 'newImg', 'nickExisted', 'loginSuccess', 'system'],
      tipInfo: '',
      nickName: '',
      userCount: '',
      historyList: [],
      showEmojiWrapper: false,
      messageInput: '',
      textColor: '#000000',
      totalEmojiNum: 0
    }
  },
  created() {
    this.init()
    let events = this.events
    for (let i = 0, len = events.length; i < len; i++) {
      this.$bus.$on(events[i], this[events[i]])
    }
    document.body.addEventListener('click', e => {
      if (e.target !== this.$refs.emojiBox && this.showEmojiWrapper) {
        this.showEmojiWrapper = !this.showEmojiWrapper
      }
    })
  },
  beforeDestroy() {
    let events = this.events
    for (let i = 0, len = events.length; i < len; i++) {
      this.$bus.$off(events[i], this[events[i]])
    }
  },
  mounted() {
    this.$socketClient.init(this.events)
  },
  methods: {
    init() {
      let routerChildrenContext = require.context('*/static/emoji/', true, /.*\.gif/)
      this.totalEmojiNum = routerChildrenContext.keys().length
    },
    login() { // 登录
      if (this.nickName) { // 检查昵称输入框是否为空
        const params = {action: 'login', data: {nickName: this.nickName}}
        this.sendMsgToServer(params) // 不为空，则发起一个login事件并将输入的昵称发送到服务器
      } else {
        this.tipInfo = '请填写昵称'
        this.$refs.nicknameInput.focus() // 否则输入框获得焦点
      }
    },
    sendMsgToServer(arg) {
      this.$socketClient.sendMsgToServer(arg)
    },
    sendMsg() {
      if (this.messageInput) {
        const params = {action: 'postMsg', data: {msg: this.messageInput, color: this.textColor}}
        this.sendMsgToServer(params)
        this._displayNewMsg(this.nickName, this.messageInput, this.textColor)
        this.messageInput = ''
      } else {
        alert('不可发送空信息')
      }
    },
    connect() { // 连接成功
      this.connected = true
      console.log('连接成功')
    },
    nickExisted() { // 昵称已存在
      this.tipInfo = '昵称已存在，请更换'
    },
    loginSuccess() { // 登录成功
      console.log('登录成功')
      this.logged = true
      this.tipInfo = ''
      document.title = '聊天室 | ' + this.nickName
    },
    disconnect() { // 断开连接
      this.tipInfo = '正在连接...'
      console.log('断开连接')
    },
    reconnect() { // 重连接
      console.log('重连接')
    },
    system({nickName, userCount, type}) { // 系统信息
      console.log('系统信息')
      console.log(nickName, userCount, type)
      var msg = nickName + (type === 'login' ? ' - 加入' : ' - 离开')
      this._displayNewMsg('system ', msg, 'red') // 指定系统消息显示为红色
      this.userCount = '在线人数：' + userCount
    },
    postMsg({user, msg, color}) { // 接收新信息
      console.log(user, msg, color)
      this._displayNewMsg(user, msg, color)
    },
    newImg({user, imgData}) {
      console.log('newImg', user)
      this._displayNewMsg(user, imgData, null, 'img')
    },
    changeImage($event) {
      let el = $event.target
      console.log(el)
      if ($event.target.files.length > 0) { // 获取文件并用FileReader进行读取
        let file = el.files[0]
        let reader = new FileReader()
        if (!reader) {
          this._displayNewMsg('system', '警告：你的浏览器不支持读取文件！', 'red')
          // el.value = ''
          return
        }
        reader.onload = (event) => { // 读取成功，显示到页面并发送到服务器
          const params = {action: 'newImg', data: {imgData: event.target.result}}
          this.sendMsgToServer(params)
          this._displayNewMsg(this.nickName, event.target.result, null, 'img')
        }
        reader.readAsDataURL(file)
      }
    },
    selectEmoji(emojiIndex) { // 选择表情符号
      this.$refs.messageInput.focus()
      this.messageInput = this.messageInput + '[emoji:' + emojiIndex + ']'
    },
    _displayNewMsg: function(user, msg, color, type = 'msg') { // 展示信息
      const histort = {user, msg, color, type}
      histort.date = new Date().toTimeString().substr(0, 8)
      this.historyList.push(histort)
      this.$refs.chatAudio.play()
      this.$nextTick(_ => {
        let historyMsgBox = this.$refs.historyMsgBox
        historyMsgBox.scrollTop = historyMsgBox.scrollHeight
      })
    },
    _analysisEmoji: function(msg) { // 解析表情
      let match
      let result = msg
      let reg = /\[emoji:\d+\]/g
      let emojiIndex
      while (match = reg.exec(msg)) { // eslint-disable-line
        emojiIndex = match[0].slice(7, -1)
        if (emojiIndex > this.totalEmojiNum) {
          result = result.replace(match[0], '[X]')
        } else {
          result = result.replace(match[0], '<img class="emoji" src="/static/emoji/' + emojiIndex + '.gif" />')
        }
      }
      return result
    }
  },
  components: {chatAudio}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import 'scss/mixins/mixin';
  html, body {
    margin: 0;
    background-color: #efefef;
    font-family: sans-serif;
  }
  .wrapper {
    height: 100%;
    padding: 0.15rem;
    margin: 0 auto;
    background-color: #ddd;
    @include flex_box();
    @include flex_direction('normal')
  }
  .loginWrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(5, 5, 5, .6);
    text-align: center;
    color: #fff;
    display: block;
    padding-top: 50%;
    .nickWrapper *{
      height: 2em;
      padding: 0 .2rem;
    }
  }
  .banner {
    /*height: 2.5rem;*/
    .banner_title{
      font-size: 0.5rem;
      line-height: 2em;
      color: #f00;
    }
    .online_count{
      font-size: 0.4rem;
      line-height: 2em;
      color: #00f;
    }
  }
  .historyMsg {
    @include flex_num(1);
    background-color: #fff;
    overflow-y: auto;
    padding: 2px;
    img {
      max-width: 50%;
    }
    .emoji{
      max-width: 100%;
    }
    .msg_item{
      padding: 0.5em 0.2em;
      text-align: left;
      line-height: 1.5em;
      .msg_content{
        max-width: 50%;
        display: inline-block;
        vertical-align: top;
      }
      .nick_name{
        font-weight: bolder;
      }
      &.my_self{
        text-align: right;
      }
    }
  }
  .timespan {
    color: #ddd;
    font-size: 0.8em;
    text-align: center;
  }
  .items {
    height: 30px;
    position: relative;
  }
  .colorStyle {
    width: 50px;
    border: none;
    padding: 0;
  }
  /*custom the file input*/

  .imageLable {
    position: relative;
  }
  #sendImage {
    position: absolute;
    width: 52px;
    left: 0;
    opacity: 0;
    overflow: hidden;
  }
  /*end custom file input*/
  .controls {
    /*height: 100px;*/
    .text_edit_control{
      @include flex_box()
    }
    /*input[type="button"]{*/
      /*border: 2px;*/
    /*}*/
  }

  .messageInput {
    height: 50px;
    @include flex_num(1)
  }
  .sendBtn {
    width: 50px;
    height: 50px;
    margin-left: 5px;
  }
  .emojiWrapper {
    width: 100%;
    bottom: 30px;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 10px #aaa;
    text-align: left;
    padding: 0.2rem;
    .emoji_box{
      max-height: 25vh;
      overflow-y: auto;
    }
    img {
      margin: 2px;
      padding: 2px;
      width: 25px;
      height: 25px;
      &:hover {
        background-color: #aaa;
      }
    }
  }
  .emoji{
    display: inline;
  }
  footer {
    text-align: center;
  }
</style>
