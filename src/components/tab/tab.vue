<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

$tab-height = 44px;
$link-border-height = 2px;
$link-padding-bottom = 5px;

.tab {
  display: flex;
  height: $tab-height;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: $link-padding-bottom;
      color: $color-text-l;
      user-select: none;
      line-height: $tab-height - $link-border-height - $link-padding-bottom;
      transition: all 0.3s;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: $link-border-height solid $color-theme;
      }
    }
  }
}
</style>
