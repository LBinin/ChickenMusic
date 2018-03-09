<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in sliderItemLength" :key="item" :class="{ active: currPageIndex === index }"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/lib/dom'

export default {
  data() {
    return {
      sliderItemLength: 0,
      currPageIndex: 0
    }
  },
  props: {
    // 默认配置
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  mounted() {
    this.$nextTick(function() {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    })

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  deactivated() {
    clearTimeout(this.timer)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  activated() {
    if (this.autoPlay) {
      this._play()
    }
  },
  methods: {
    // 计算滚动图的宽度及添加类名等操作
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children // 把轮播图 DOM 数组存放到实例中
      let width = 0 // 用于计算总宽度
      let sliderWidth = this.$refs.slider.clientWidth // 轮播图区域宽度

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i] // 获取每个轮播图 DOM
        addClass(child, 'slider-item') // 为每个轮播图添加类名

        child.style.width = sliderWidth + 'px' // 为每个轮播图添加宽度 这里等于区域宽度
        width += child.clientWidth // 计算总宽度
      }

      // 如果循环，左右两边各有一个 DOM 以保证无缝循环
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }

      // 为轮播图容器设置宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化 Dots 部分
    _initDots() {
      this.sliderItemLength = this.children.length
    },
    // 初始化配置 BetterScroll 插件
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        click: true
      })

      // 监听滚动结束，更新 Dots
      this.slider.on('scrollEnd', () => {
        this.currPageIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    // 自动滚动
    _play() {
      this.timer = setTimeout(() => {
        // 跳转到指定页面
        this.slider.next(400)
      }, this.interval)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 5px;
      background: $color-text-l;
      transition: all 0.35s;

      &.active {
        width: 20px;
        background: $color-text-ll;
      }
    }
  }
}
</style>