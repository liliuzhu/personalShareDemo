<template>
  <div id="app">
    <navigation/>
    <router-view>
      <div>我是router-view的children</div>
    </router-view>
  </div>
</template>

<script>
import navigation from '@/components/Navigation'

export default {
  name: 'App',
  components: {navigation}
}
/* window.getHash = function () {
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''
  href = href.slice(index + 1)
  const searchIndex = href.indexOf('?')
  if (searchIndex < 0) {
    const hashIndex = href.indexOf('#')
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex)
    } else href = decodeURI(href)
  } else {
    if (searchIndex > -1) {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex)
    }
  }

  return href
} */
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
