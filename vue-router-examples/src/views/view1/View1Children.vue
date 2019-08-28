<template>
  <div class="children-view view1-children">
    <div>{{content}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'View1Children',
  data () {
    return {
      content: '页面1子路由'
    }
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view1-children{
   background-color: #f0f;
 }
</style>
