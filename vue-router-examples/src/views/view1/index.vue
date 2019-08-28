<template>
  <div class="view1">
    <div>{{content}}</div>
    <router-view/>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'view1',
  data () {
    return {
      content: 'view1'
    }
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view1{
   min-height: 200px;
   background-color: #0f0;
 }
</style>
