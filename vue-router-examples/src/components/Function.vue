<script>
export default {
  name: 'Function',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render (createElement, context) {
    console.log('自定义functional')
    console.log(createElement, context)
    // const h = context.parent.$createElement
    return createElement()
  }
}
</script>

<style rel="stylesheet/css" type="text/css" lang="scss">

</style>
