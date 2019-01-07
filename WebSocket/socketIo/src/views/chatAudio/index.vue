<template>
  <audio id="chatAudio" ref="chatAudio" class="chatAudio" preload="auto" style="display: none;">
    <source src="./notify.ogg" type="audio/ogg">
    <source src="./notify.mp3" type="audio/mpeg">
    <source src="./notify.wav" type="audio/wav">
  </audio>
</template>

<script>
export default {
  name: 'chat-audio',
  mounted() {
    // this.play(true)
  },
  data() {
    return {}
  },
  methods: {
    play(init) {
      const chatAudio = this.$refs.chatAudio
      if (init) {
        chatAudio.volume = 0
        chatAudio.muted = true
      } else {
        chatAudio.volume = 1
        chatAudio.muted = false
      }
      chatAudio.play()
    }
  }
}
</script>

<style scoped>

</style>
