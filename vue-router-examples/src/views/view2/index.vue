<template>
  <div class="view view2">
    <div>{{content}}</div>
    <router-view/>
    <router-view name="view2"/>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'view2',
  data () {
    return {
      content: 'view2'
    }
  },
  watch: {
    $route (nval, oval) {
      console.log('$route变化')
      console.log(nval, oval, this.$router)
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave')
    console.log(to, from)
    next()
  },
  created () {
    console.log(this)
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view2{
   min-height: 200px;
   background-color: #00f;
 }
</style>
