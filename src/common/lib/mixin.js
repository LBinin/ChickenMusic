import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.hadnlePlaylist(this.playlist)
  },
  activated() { // keep-alive 激活的时候
    this.hadnlePlaylist(this.playlist)
  },
  watch: {
    playlist(newList) {
      this.hadnlePlaylist(newList)
    }
  },
  methods: {
    hadnlePlaylist() { // 引用的组件需要复写，以覆盖 hadnlePlaylist，相当于继承
      throw new Error('component must implement handlePlaylist method')
    }
  }
}