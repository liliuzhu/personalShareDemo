<template>
  <div id="app">
    <navigation/>
    <router-view/>
  </div>
</template>

<script>
import navigation from '@/components/Navigation'

export default {
  name: 'App',
  components: {navigation}
}
</script>

<style lang="scss">
  body, html {
    padding: 0;
    margin: 0;
    font-size: 20px;
  }
  .view{
    min-height: 200px;
  }
  .children-view {
    min-height: 100px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*padding: 20px;*/
    /*margin-top: 60px;*/
  }
</style>
