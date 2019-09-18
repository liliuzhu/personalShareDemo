<template>
  <div class="navigation">
    <ul class="top_list">
      <li><a href="#/">首页/</a></li>
      <li><router-link to="/">首页</router-link></li>
      <li>
        <ul>
          <li><router-link to="/view1">页面1</router-link></li>
          <li><router-link to="/view1/view1Children?weer=哈#&sads=qwew">页面1子路由</router-link></li>
        </ul>
      </li>
      <li>
        <ul>
          <li><router-link to="/view2">页面2</router-link></li>
          <li><router-link to="/view2/view2Children">页面2子路由</router-link></li>
        </ul>
      </li>
      <li><router-link to="/view3">新路由</router-link></li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'Navigation',
  data () {
    return {
      content: 'view1'
    }
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
  .navigation {
    background-color: #aaa;
    text-align: left;
    padding: 20px;
    ul{
      margin: 0;
      padding: 0;
      list-style: none;
      &.top_list > li{
        display: inline-block;
        vertical-align: top;
        padding-right: 10px;
      }
    }
  }
  .router-link-exact-active {
    color: red;
  }
</style>
