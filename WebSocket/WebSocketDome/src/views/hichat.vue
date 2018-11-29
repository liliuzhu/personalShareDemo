<template>
  <div>
    <div class="wrapper">
      <div class="banner">
        <h1>群聊！</h1>
        <span id="status"></span>
      </div>
      <div id="historyMsg">
      </div>
      <div class="controls" >
        <div class="items">
          <input id="colorStyle" type="color" placeHolder='#000' title="font color" />
          <input id="emoji" type="button" value="emoji" title="emoji" />
          <label for="sendImage" class="imageLable">
            <input type="button" value="image"  />
            <input id="sendImage" type="file" value="image"/>
          </label>
          <input id="clearBtn" type="button" value="clear" title="clear screen" />
        </div>
        <textarea id="messageInput" placeHolder="enter to send"></textarea>
        <input id="sendBtn" type="button" value="SEND">
        <div id="emojiWrapper">
        </div>
      </div>
    </div>
    <div class="loginWrapper" v-if="!connect || !loginSuccess">
      <p v-if="!connect">正在连接...</p>
      <div class="nickWrapper" v-if="connect && !loginSuccess">
        <input type="text" placeHolder="请输入账号" id="nicknameInput" />
        <input type="button" value="OK" id="loginBtn" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      connect: true,
      loginSuccess: true,
      events: ['connect', 'reconnect', 'disconnect', 'newMsg', 'nickExisted', 'loginSuccess', 'system']
    }
  },
  created() {

  },
  beforeDestroy() {

  },
  mounted() {
    this.$socketClient.init(this.events)
  },
  methods: {
    message(...arg) {
      console.log(arg)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  html, body {
    margin: 0;
    background-color: #efefef;
    font-family: sans-serif;
  }
  .wrapper {
    width: 100%;
    height: 640px;
    padding: 5px;
    margin: 0 auto;
    background-color: #ddd;
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
  .controls {
    height: 100px;
    margin: 5px 0px;
    position: relative;
  }
  #historyMsg {
    height: 400px;
    background-color: #fff;
    overflow: auto;
    padding: 2px;
  }
  #historyMsg img {
    max-width: 99%;
  }
  .timespan {
    color: #ddd;
  }
  .items {
    height: 30px;
  }
  #colorStyle {
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

  #messageInput {
    width: 440px;
    max-width: 440px;
    height: 90px;
    max-height: 90px;
  }
  #sendBtn {
    width: 50px;
    height: 96px;
    float: right;
  }
  #emojiWrapper {
    display: none;
    width: 100%;
    bottom: 105px;
    position: absolute;
    background-color: #aaa;
    box-shadow: 0 0 10px #555;
  }
  #emojiWrapper img {
    margin: 2px;
    padding: 2px;
    width: 25px;
    height: 25px;
  }
  #emojiWrapper img:hover {
    background-color: blue;
  }
  .emoji{
    display: inline;
  }
  footer {
    text-align: center;
  }
  #historyMsg img {
    max-width: 99%;
  }
</style>
