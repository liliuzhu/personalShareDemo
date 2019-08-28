<template>
  <div class="view index">{{content}}</div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'view1',
  data () {
    return {
      content: '首页'
    }
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .index{
   background-color: #f00;
 }
</style>
