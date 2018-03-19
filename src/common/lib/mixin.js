import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() { // keep-alive 激活的时候
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newList) {
      this.handlePlaylist(newList)
    }
  },
  methods: {
    handlePlaylist() { // 引用的组件需要复写，以覆盖 handlePlaylist，相当于继承
      throw new Error('component must implement handlePlaylist method')
    }
  }
}