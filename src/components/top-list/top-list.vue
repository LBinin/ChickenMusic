<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/lib/song'

export default {
  data() {
    return {
      songs: [],
      bgImage: ''
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then(data => {
        if (data.code === ERR_OK) {
          this.bgImage = data.topinfo.pic_album.replace('300x300', '500x500')
          this.songs = this._normalizeSongs(data.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created() {
    this._getMusicList()
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>