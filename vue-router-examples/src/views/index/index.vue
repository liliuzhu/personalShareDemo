<template>
  <div class="view index">
    <function>
      <div>123</div>
    </function>
    {{content}}
  </div>
</template>
<script type="text/ecmascript-6">
import Function from '@/components/Function'
export default {
  name: 'view1',
  data () {
    return {
      content: '首页'
    }
  },
  beforeCreate () {
    console.log(this)
  },
  components: {Function}
}
</script>
<style rel="stylesheet/css" type="text/css" lang="scss">
 .index{
   background-color: #f00;
 }
</style>
