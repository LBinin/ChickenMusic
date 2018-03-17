<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtnWrapper"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    percent: {
      type: Number,
      default: 0.5
    }
  },
  created() {
    this.touch = {} // 记录 touch 相关信息
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true // 初始化标志位
      this.touch.startX = e.touches[0].pageX // 初始位置
      this.touch.left = this.$refs.progress.clientWidth // 滚动条的进度
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 移动偏移量
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX)) // 不能大于滚动条宽度，不能小于 0
      this._offset(offsetWidth / this.$refs.progressBar.clientWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      // 点击的时候 e.offsetX 获取异常，修复异常：改变获取方法
      const rect = this.$refs.progressBar.getBoundingClientRect()
      let offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth / this.$refs.progressBar.clientWidth)
      this._triggerPercent()
    },
    _triggerPercent() { // 通知父组件改变进度
      const percent = this.$refs.progress.clientWidth / this.$refs.progressBar.clientWidth
      this.$emit('percentChange', percent)
    },
    _offset(offsetWidth) { // 改变进度
      this.$refs.progress.style.width = `${offsetWidth * 100}%`
      this.$refs.progressBtnWrapper.style.left = `${offsetWidth * 100}%`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        this.$refs.progress.style.width = `${newPercent * 100}%`
        this.$refs.progressBtnWrapper.style.left = `${newPercent * 100}%`
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
      border-radius: 2px;
    }

    .progress-btn-wrapper {
      // position: absolute;
      // left: -8px;
      // top: -13px;
      width: 30px;
      height: 30px;
      position: relative;
      transform: translate(-50%, -50%);
      top: 2px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>