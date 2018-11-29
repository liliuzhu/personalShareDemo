<template>
  <main class="rc-page">
    <slot></slot>
  </main>
</template>
<script>
import TitleMixin from '@/mixins/title.mixin'

export default {
  name: 'rc-page',
  mixins: [TitleMixin],
  props: {
    title: String
  },
  created() {
    this.$route.meta.keepAlive || this.updateTitle(this.title || '人人车')
  },
  activated() {
    this.updateTitle(this.title || '人人车')
  }
}
</script>
<style lang="scss">
  %content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  html {
    @extend %content;

    body,
    #app {
      @extend %content;
    }
  }

  .rc-page {
    @extend %content;
  }
</style>
