<template>
  <scroll class="suggest" ref="suggest" :pullUp="pullUp" :beforeScroll="beforeScroll" @scrollToEnd="loadMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="" class="loading"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/lib/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/lib/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullUp: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  methods: {
    search(query, loadMore = false) {
      this.hasMore = true
      if (!loadMore) {
        // 每次获取的时候初始化
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
      }
      search(query, this.page, +this.showSinger, PER_PAGE).then(data => {
        if (data.code === ERR_OK) {
          this.result = loadMore
            ? this.result.concat(this._getResult(data.data, true))
            : this._getResult(data.data)
          this._checkMore(data.data)
        }
      })
    },
    loadMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      this.search(this.query, true)
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
          size: 300
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      // 判断是否还有更多
      const song = data.song
      if (!song.list.length || song.curnum * song.curpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult(data, loadMore) {
      let ret = []
      if (!loadMore && data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida, // 放入歌手
          ...{
            type: TYPE_SINGER // 添加歌手标识
          }
        })
      }
      if (data.song) {
        // 添加歌曲
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this.search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }

    .loading {
      padding-bottom: 20px;
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>