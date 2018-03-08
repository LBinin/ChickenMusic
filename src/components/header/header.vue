<template>
  <div class="header">
    <div class="icon"></div>
    <div class="text">Chicken Music</div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      bg-image('logo')
      display: inline-block
      vertical-align: top
      width: 30px
      height: 32px
      margin-top: 6px
      margin-right: 9px
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
