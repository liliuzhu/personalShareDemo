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
    console.log(createElement, context)
    return createElement()
  }
}
</script>

<style rel="stylesheet/css" type="text/css" lang="scss">

</style>
