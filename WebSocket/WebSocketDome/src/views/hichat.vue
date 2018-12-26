<template>
  <rc-page title="聊天室">
    <div class="wrapper">
      <div class="banner">
        <h1>供应链前端周会！</h1>
        <span>{{userCount}}</span>
      </div>
      <div class="historyMsg">
        <p v-for="(item,index) in historyList" :key="index" :style="{color: item.color}">{{item.user}}<span class="timespan">({{item.date}})</span>{{item.msg}}</p>
      </div>
      <div class="controls" >
        <div class="items">
          <input class="colorStyle" type="color" v-model="textColor" title="文本颜色"/>
          <button title="表情" @click.stop="showEmojiWrapper=!showEmojiWrapper">表情</button>
          <label for="sendImage" class="imageLable">
            <button>图片</button>
            <input id="sendImage" type="file" value="图片"/>
          </label>
          <button title="清空屏幕">清空</button>
          <div class="emojiWrapper" v-show="showEmojiWrapper">
            <div class="emoji_box" ref="emojiBox">
              <img class="emoji" @click="selectEmoji(index)" v-for="index in 75" :key="index" :src="'/static/emoji/'+index+'.gif'" :alt="index" :title="index"/>
            </div>
          </div>
        </div>
        <div class="text_edit_control">
          <textarea class="messageInput" ref="messageInput" v-model="messageInput" placeholder="请输入" @keyup.enter="sendmsg"></textarea>
          <button class="sendBtn" @click="sendmsg">发送</button>
        </div>
      </div>
    </div>
    <div class="loginWrapper" v-if="!connected || !logged">
      <p v-show="tipInfo">{{tipInfo}}</p>
      <div class="nickWrapper" v-if="connected && !logged">
        <input type="text" placeHolder="请输入账号" v-model="nickName" @keyup.enter="login" class="nicknameInput" ref="nicknameInput"/>
        <input type="button" value="登录"  @click="login"/>
      </div>
    </div>
  </rc-page>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      connected: false,
      logged: false,
      events: ['connect', 'reconnect', 'disconnect', 'newMsg', 'nickExisted', 'loginSuccess', 'system'],
      tipInfo: '',
      nickName: '',
      userCount: '',
      historyList: [],
      showEmojiWrapper: false,
      messageInput: '',
      textColor: '#000000'
    }
  },
  created() {
    let events = this.events
    for (let i = 0, len = events.length; i < len; i++) {
      // this.$bus.$on(events[i], (arg) => {
      //   console.log(2, events[i])
      //   arg.unshift(events[i])
      //   this.message(...arg)
      // })
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
    login() { // 登录
      if (this.nickName) { // 检查昵称输入框是否为空
        this.sendMsgToServer('login', this.nickName) // 不为空，则发起一个login事件并将输入的昵称发送到服务器
      } else {
        this.tipInfo = '请填写昵称'
        this.$refs.nicknameInput.focus() // 否则输入框获得焦点
      }
    },
    sendMsgToServer(...arg) {
      this.$socketClient.sendMsgToServer(...arg)
    },
    sendmsg() {
      this.sendMsgToServer('postMsg', this.messageInput, this.textColor)
      this.messageInput = ''
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
    system(nickName, userCount, type) { // 系统信息
      console.log('系统信息')
      console.log(nickName, userCount, type)
      this.userCount = '在线人数：' + userCount
    },
    newMsg(user, msg, color) { // 接收新信息
      console.log(user, msg, color)
      this._displayNewMsg(user, msg, color)
    },
    selectEmoji(emojiIndex) {
      this.$refs.messageInput.focus()
      this.messageInput = this.messageInput + '[emoji:' + emojiIndex + ']'
    },
    _displayNewMsg: function(user, msg, color) { // 展示信息
      const histort = {user, msg, color}
      histort.date = new Date().toTimeString().substr(0, 8)
      this.historyList.push(histort)
      // var container = document.getElementById('historyMsg'),
      //   msgToDisplay = document.createElement('p'),
      //   date = new Date().toTimeString().substr(0, 8),
      //   //将消息中的表情转换为图片
      //   msg = this._showEmoji(msg);
      // msgToDisplay.style.color = color || '#000';
      // msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
      // container.appendChild(msgToDisplay);
      // container.scrollTop = container.scrollHeight;
    }
  }
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
    padding: 5px;
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
    padding-top: 200px;
  }
  .banner {
    height: 80px;
    width: 100%;
  }
  .banner p {
    float: left;
    display: inline-block;
  }
  .historyMsg {
    @include flex_num(1);
    background-color: #fff;
    overflow-y: auto;
    padding: 2px;
    img {
      max-width: 50%;
    }
  }
  .timespan {
    color: #ddd;
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
