<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    // https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#probetype
    // 访问滚动位置方式
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullUp: {
      type: Boolean,
      default: true
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return // 如果 wrapper DOM 还未初始化，就 return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }

      // 上拉加载更多
      if (this.pullUp) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 方法代理
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style scoped>

</style>