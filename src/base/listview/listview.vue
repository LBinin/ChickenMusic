<template>
  <scroll class="listview"
  ref="listview"
  :listenScroll="listenScroll"
  :probeType="probeType"
  @scroll="scroll">
    <ul> <!-- 用来承载滚动内容 -->
      <li v-for="group in data" class="list-group" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
            <img v-lazy="item.avatar" :alt="item.name" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧快速入口 -->
    <div v-show="data.length" class="list-shortcut">
      <ul @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend="onShortcutTouchEnd">
        <li v-for="(item, index) in shortcutList" class="item" :key="item" :data-index="index" :class="{ 'current': currIndex === index }">{{ item }}</li>
        <div class="index-tip" ref="indexTip">{{ shortcutList[currIndex] }}</div>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/lib/dom'

const ANCHOR_HEIGHT = 18 // font-size: 12px, padding 3px; 12 + 3 * 2 = 18
const TITLE_HEIGHT = 30
const SCROLL_SPEED = 300 // 快速入口滑动时，左侧滚动动画时间

export default {
  created() {
    // 不放在 data 里是因为不需要监听这些属性的变化
    this.touch = {} // 存放右侧快速入口的 touch 信息
    this.listenScroll = true // 是否监听滚动事件
    this.probeType = 3 // 因为要实时获取滚动位置
  },
  data() {
    return {
      scrollY: -1,
      tipTimer: null,
      currIndex: 0, // 对应到快速入口
      listHeight: [], // 用来存放各个 item 的高读
      diff: -1 // 每个 group 的顶部高度与容器顶部的滚动差
    }
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(value => {
        return value.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currIndex] ? this.data[this.currIndex].title : ''
    }
  },
  methods: {
    /* 点击快速入口跳转 */
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)

      this._showIndexTip(true)
      this._scrollIndexTip(anchorIndex)
    },
    /* 快速入口滑动 */
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0 // 向下取整
      let anchorIndex = +this.touch.anchorIndex + delta

      // 控制边界
      if (anchorIndex < 0) {
        anchorIndex = 0
      } else if (anchorIndex >= this.$refs.listGroup.length) {
        anchorIndex = this.$refs.listGroup.length - 1
      }

      this._scrollTo(anchorIndex)
      this._scrollIndexTip(anchorIndex)
    },
    onShortcutTouchEnd(e) {
      this._showIndexTip(false)
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    /* 监听歌手列表滚动事件 */
    scroll(pos) {
      this.scrollY = pos.y
    },
    _showIndexTip(show) {
      const tip = this.$refs.indexTip
      if (show) {
        tip.style.opacity = 1
        clearTimeout(this.tipTimer)
      } else {
        this.tipTimer = setTimeout(() => {
          tip.style.opacity = 0
        }, 500)
      }
    },
    _scrollIndexTip(index) {
      this.$refs.indexTip.style.top = index * 18 + (18 + 5) / 2 + 'px'
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(
        this.$refs.listGroup[index],
        SCROLL_SPEED
      )
    },
    _calculateHeight() {
      this.listHeight = [0]
      const list = this.$refs.listGroup
      let height = 0
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    /* 监听列表滚动 */
    scrollY(newY) {
      const listHeight = this.listHeight
      /* 当 newY > 0 时表示滚动到顶部 */
      if (newY > 0) {
        this.currIndex = 0
        return
      }
      /* 在中间部分滚动 */
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currIndex = i
          this.diff = height2 + newY
          return
        }
      }
      /* 当滚动到底部，且-newY大于最后一个元素的上限 */
      this.currIndex = listHeight.length - 2
    },
    diff(newVal) {
      // 当 diff 小于标题高度大于 0 时候，说明这时候需要上移 fixed，值就是为 newVal - TITLE_HEIGHT
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }

    .index-tip {
      position: absolute;
      top: 0;
      right: 30px;
      background: $color-background-d;
      padding: 10px 0;
      width: 40px;
      text-align: center;
      border-radius: 5px;
      opacity: 0;
      font-size: $font-size-large;
      pointer-events: none;
      transition: all 0.25s;
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
