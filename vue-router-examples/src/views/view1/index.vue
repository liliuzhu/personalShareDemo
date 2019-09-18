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
  },
  mounted () { // 已挂载
    this.$router.addRoutes([{
      path: '/view3',
      name: 'view3',
      component: () => import('@/views/view3'),
      mate: {
        title: 'view3'
      }
    }])
  }

}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .view1{
   min-height: 200px;
   background-color: #0f0;
 }
</style>
