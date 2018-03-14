<template>
  <transition name="slide">
    <div class="singer-detail">{{ singer.name }}</div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong } from 'common/lib/song'
import { ERR_OK } from 'api/config'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer'])
  },
  created() {
    // 如果没有 singer.id 就会到 singer 页面
    if (!this.singer.id) {
      this.$router.push('/singer')
    }
    // 获取歌手详情
    this._getSingerDetail(this.singer.id)
  },
  methods: {
    _getSingerDetail(id) {
      getSingerDetail(id).then(data => {
        if (data.code === ERR_OK) {
          this.songs = this._normalizeSongs(data.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      let map = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          map.push(createSong(musicData))
        }
      })
      return map
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>