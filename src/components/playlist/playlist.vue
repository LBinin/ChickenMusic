<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click.self="hide">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span @click="showConfirm" class="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
          <transition-group name="list" tag="ul">
            <li ref="listItem" @click="selectItem(item, index)" class="item" v-for="(item, index) in sequenceList" :key="item.id">
              <i class="current" :class="getCurrIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/lib/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { playerMixin } from 'common/lib/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrSong(this.currSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    getCurrIcon(item) {
      return this.currSong.id === item.id ? 'icon-play' : ''
    },
    selectItem(song, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(item => {
          return item.id === song.id
        })
      }
      console.log(index)
      this.setCurrIndex(index)
      this.setPlayingState(true)
      // this.setFullScreen(true)
      // this.hide()
    },
    scrollToCurrSong(curr) {
      console.log(curr)
      const index = this.sequenceList.findIndex(item => {
        return item.id === curr.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    deleteOne(item) {
      this.deleteSong(item)
      if (!this.playlist.length) { // 没有歌曲了就隐藏
        this.hide()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    ...mapMutations({
      // setCurrIndex: 'SET_CURR_INDEX',
      setFullScreen: 'SET_FULL_SCREEN'
      // setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrSong(newSong)
    }
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: all 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>