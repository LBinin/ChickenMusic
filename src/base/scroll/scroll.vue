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
    }
  }
}
</script>

<style scoped>

</style>