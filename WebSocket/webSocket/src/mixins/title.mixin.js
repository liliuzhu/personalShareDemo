export default {
  methods: {
    updateTitle (title) {
      this.$doc = document
      if (title === undefined || this.$doc.title === title) {
        return
      }
      this.$doc.title = title
    }
  }
}
