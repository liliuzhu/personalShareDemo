<template>
  <div class="content">
    <mt-button type="primary" @click="callNativeFunction">调用安卓的方法</mt-button>
    <mt-button type="danger">danger</mt-button>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'home',
  data() {
    return {}
  },
  created() {
    // this.$router.replace({path: '/car-owner-service'})
  },
  methods: {
    callNativeFunction() {
      if (window.JSBridge) {
        window.JSBridge.AndroidToastMessage('js调用了安卓的方法')
      }
    }
  }
}
</script>
<style lang="scss">
  .content{
    padding: 1rem;
    text-align: center;
  }
</style>
