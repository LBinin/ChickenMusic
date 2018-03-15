<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from 'api/config'
import { getSingerList } from 'api/singer'
import Singer from 'common/lib/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import * as mutationsTypes from 'src/store/mutation-types'

const HOT_TAG = '热门'
const HOT_SINGER_LENGTH = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push(`/singer/${singer.id}`)
      this.setSinger(singer)
    },
    /* 获取歌手列表 */
    _getSingerList() {
      getSingerList().then(data => {
        if (data.code === ERR_OK) {
          this.singers = this._normalizeSinger(data.data.list)
        }
      })
    },
    /* 歌手排序 */
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_TAG,
          items: []
        }
      }
      list.forEach((item, index) => {
        // push 热门歌手
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              size: 300
            })
          )
        }
        // 分类
        const key = item.Findex
        if (!map[key]) {
          // 没有当前组别的话新建一个
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            size: 300
          })
        )
      })
      // map 排序
      let hot = []
      let rest = []
      for (let key in map) {
        let item = map[key]
        // 分类
        if (item.title.match(/[a-zA-Z]/)) {
          rest.push(item)
        } else if (item.title === HOT_TAG) {
          hot.push(item)
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(rest)
    },
    ...mapMutations({
      setSinger: mutationsTypes.SET_SINGER
    })
  },
  components: {
    ListView
  }
}
</script>

<style scoped lang="stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>