<template>
    <div class="blank_content">
      <div class="tip_content">
        <img class="blank_content--img" src="../../../../assets/img/ic_blank.png"/>
        <span class="blank_content_default">您还没有车主服务订单</span>
        <span class="blank_content_hint">如需速卖请联系我们</span>
        <span class="blank_content_hint"><a href="tel:4000910002">400 091 0002</a></span>
      </div>
    </div>
</template>
<style lang="scss">
  @import 'scss/mixins/mixin';
  .blank_content {
    @include flex_box();
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
    .tip_content *{
      text-align: center;
      display: block;
    }
    .blank_content--img {
      height: 4rem;
    }
    .blank_content_default {
      margin-top: 0.38rem;
      margin-bottom: 0.3rem;
      font-family: PingFangSC-Regular;
      font-size: 0.38rem;;
      color: rgba(0,0,0,0.78);
      text-align: center;
      line-height: 0.38rem;
    }
    .blank_content_hint {
      font-family: PingFangSC-Regular;
      font-size: 0.34rem;
      color: rgba(0,0,0,0.36);
      text-align: center;
      line-height: 0.38rem;
      margin-bottom: 0.3rem;
      a:focus, a:active, a:visited, a:hover {
        text-decoration: none;
      }
    }
  }
</style>
