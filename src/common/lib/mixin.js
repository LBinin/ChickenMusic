import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/lib/config'
import { shuffle } from 'common/lib/util'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    // keep-alive 激活的时候
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newList) {
      this.handlePlaylist(newList)
    }
  },
  methods: {
    handlePlaylist() {
      // 引用的组件需要复写，以覆盖 handlePlaylist，相当于继承
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      switch (this.mode) { // 判断当前播放模式
        case playMode.sequence:
          return 'icon-sequence'
        case playMode.random:
          return 'icon-random'
        case playMode.loop:
          return 'icon-loop'
        default:
          return 'icon-sequence'
      }
    },
    ...mapGetters(['currSong', 'mode', 'playlist', 'sequenceList', 'favoriteList'])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        /* 深复制一份对象，否则 sequence 也会被改变 */
        let arr = this.sequenceList.slice()
        list = shuffle(arr)
      } else {
        list = this.sequenceList
      }

      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    _resetCurrentIndex(list) {
      // 保证切换模式后不更换歌曲
      let index = list.findIndex(item => {
        return item.id === this.currSong.id
      })
      this.setCurrIndex(index)
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })

      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrIndex: 'SET_CURR_INDEX',
      setPlayMode: 'SET_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query.trim())
    },
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory'
    ])
  }
}