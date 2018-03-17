<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content">
      <!-- 滚动组件需要父子元素，子元素用来承载滚动内容，撑开容器实现滚动 -->
      <div>
        <!-- 焦点滚动图 -->
        <div class="slider-wrapper">
          <slider v-if="recommends.length">
            <div v-for="item in recommends" :key="item.linkUrl">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul v-if="discList.length">
            <li @click="selectItem(item)" v-for="item in discList" class="item" :key="item.dissid">
              <div class="logo">
                <img v-lazy="item.imgurl" :alt="item.dissname">
              </div>
              <div class="intro">
                <h2 class="title" v-html="item.dissname"></h2>
                <p class="creator" v-html="item.creator.name"></p>
              </div>
            </li>
          </ul>
          <div v-else class="loading-container">
            <loading/>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/lib/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    hadnlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.recommend.style.bottom = bottom
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    /* 获取轮播图数据 */
    _getRecommend() {
      getRecommend().then(data => {
        if (data.code === ERR_OK) {
          // 获取到轮播图数据
          this.recommends = data.data.slider
        }
      })
    },
    /* 获取歌单数据 */
    _getDiscList() {
      getDiscList().then(data => {
        if (data.code === ERR_OK) {
          this.discList = data.data.list
        }
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-style: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .logo {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;

          img {
            width: 100%;
          }
        }

        .intro {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }

        .title {
          margin-bottom: 10px;
          color: $color-text;
        }

        .creator {
          color: $color-text-d;
        }
      }

      .loading-container {
        width: 100%;
        margin-top: 20%;
      }
    }
  }
}
</style>