<template>
  <div class="children-view view2-children1">
    <div>{{content}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'View2Children1',
  data () {
    return {
      content: '页面2子路由1'
    }
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view2-children1{
   background-color: #ff0;
 }
</style>
