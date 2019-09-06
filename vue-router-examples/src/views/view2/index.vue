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
      console.log(nval, oval, this.$router)
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log(to, from, next)
    next()
  },
  created () {
    // console.log(this.$route)
    // console.log(this.$router)
  }
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view2{
   min-height: 200px;
   background-color: #00f;
 }
</style>
