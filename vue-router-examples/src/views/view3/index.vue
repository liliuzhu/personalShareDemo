<template>
  <div class="index view">
    {{content}}
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'view3',
  data () {
    return {
      content: 'view3'
    }
  },
  mounted () { // 已挂载
    // console.log(this.$router)
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .index{
   background-color: #0ff;
 }
</style>
