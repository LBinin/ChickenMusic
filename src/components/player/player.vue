<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currSong.name"></h1>
          <h2 class="subtitle" v-html="currSong.singer"></h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdState">
                <img class="image" :src="currSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLryic }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currLyric">
                <p class="text" :class="{'current': index === currLineNum}" ref="lyricLine" v-for="(line, index) in currLyric.lines" :key="line.time">{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ 'active': currPage === 'cd' }"></span>
            <span class="dot" :class="{ 'active': currPage === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ _format(currTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"/>
            </div>
            <span class="time time-r">{{ _format(currSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="diableClass">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="diableClass">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="diableClass">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdState" width="40" height="40" :src="currSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currSong.name"></h2>
          <p class="desc" v-html="currSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle, addClass, removeClass } from 'common/lib/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/lib/config'
import { shuffle } from 'common/lib/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')

export default {
  data() {
    return {
      songReady: false,
      currTime: 0, // 歌曲播放的时间
      currLyric: null,
      currLineNum: 0,
      currPage: 'cd', // 当前为哪页
      playingLryic: '' // 正在播放的歌词
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdState() {
      return this.playing ? 'play' : 'play pause'
    },
    diableClass() {
      // 在歌曲准备的时候 disable 样式
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currTime / this.currSong.duration
    },
    iconMode() {
      switch (this.mode) { // 判断当前播放模式
        case playMode.sequence:
          return 'icon-sequence'
        case playMode.random:
          return 'icon-random'
        case playMode.loop:
          return 'icon-loop'
        default:
          return 'icon-sequence'
      }
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'sequenceList',
      'currSong',
      'playing',
      'currIndex',
      'mode'
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false) // 相当于 this.$store.commit('SET_FULL_SCREEN')
    },
    open() {
      this.setFullScreen(true)
    },
    togglePlaying() {
      // 等待歌曲 ready
      if (!this.songReady) {
        return
      }
      if (this.currLyric) {
        this.currLyric.togglePlay()
      }
      this.setPlayingState(!this.playing)
    },
    next() {
      // 等待歌曲 ready
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) { // 边界条件处理
        this.loop()
      } else {
        // 顺序播放
        let index = this.currIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrIndex(index)
        // 继续播放歌曲
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    prev() {
      // 等待歌曲 ready
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) { // 边界条件处理
        this.loop()
      } else {
        // 顺序播放
        let index = this.currIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrIndex(index)
        // 继续播放歌曲
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() {
      alert('error')
      this.songReady = true
    },
    updateTime(e) {
      this.currTime = e.target.currentTime
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop() { // 歌曲循环
      this.$refs.audio.currTime = 0
      this.$refs.audio.play()
      if (this.currLyric) {
        this.currLyric.seek(0)
      }
    },
    onProgressBarChange(percent) {
      // 拖动进度条
      const currTime = percent * this.currSong.duration
      this.$refs.audio.currentTime = currTime
      if (!this.playing) { // 自动播放
        this.togglePlaying()
      }
      if (this.currLyric) { // 调整歌词位置
        this.currLyric.seek(currTime * 1000)
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        /* 深复制一份对象，否则 sequence 也会被改变 */
        let arr = JSON.parse(JSON.stringify(this.sequenceList))
        list = shuffle(arr)
      } else {
        list = this.sequenceList
      }

      this._resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      this.touch.percent = null
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 在歌词界面的时候滚动歌词的时候不会横向滚动
        return
      }
      const offsetLeft = this.currPage === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, offsetLeft + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` // 因为是一个组件所以需要使用 $el 获取元素
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      addClass(this.$refs.lyricList.$el, 'move')
      addClass(this.$refs.middleL, 'move')
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currPage === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currPage = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent && this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currPage = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.middleL.style.opacity = opacity
      removeClass(this.$refs.lyricList.$el, 'move')
      removeClass(this.$refs.middleL, 'move')
    },
    _resetCurrentIndex(list) {
      // 保证切换模式后不更换歌曲
      let index = list.findIndex(item => {
        return item.id === this.currSong.id
      })
      this.setCurrIndex(index)
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 500,
          easing: 'ease-in-out'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.5s'
      const { x, y, scale } = this._getPosAndScale()

      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    getLyric() {
      this.currSong.getLyric().then(lyric => {
        this.currLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currLyric.play()
        }
      }).catch(() => { // 获取歌词失败
        this.currLyric = null
        this.playingLryic = null
        this.currLineNum = 0
      })
    },
    handleLyric({ lineNum, txt }) {
      // 高亮歌词
      this.currLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLryic = txt
    },
    _format(interval) {
      // 格式化时间
      interval = ~~interval
      const minute = (interval / 60) | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      // 字符串补位
      // 头部补 0
      let length = num.toString().length
      while (length < n) {
        num = '0' + num
        length++
      }
      return num
    },
    _getPosAndScale() {
      const targetWidth = 40
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width

      // 以左下角为 (0, 0) 点
      const miniX = 40
      const normalPaddingTop = 80
      const miniY = 30
      const diffX = -(window.innerWidth / 2 - miniX)
      const diffY = window.innerHeight - normalPaddingTop - width / 2 - miniY

      return { x: diffX, y: diffY, scale }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrIndex: 'SET_CURR_INDEX',
      setPlayMode: 'SET_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  watch: {
    currSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        // 在当前歌曲暂停是切换
        return
      }
      if (this.currLyric) { // 重置歌词进度
        this.currLyric.stop()
        this.currLineNum = 0
      }
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing(newVal) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        transition: all 0.3s;

        &.move {
          transition: none;
        }

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: all 0.3s;
        -webkit-mask-image: linear-gradient(to bottom,rgba(255,255,255,0) 0,rgba(255,255,255,.6) 15%,rgba(255,255,255,1) 25%,rgba(255,255,255,1) 75%,rgba(255,255,255,.6) 85%,rgba(255,255,255,0) 100%)

        &.move {
          transition: none;
        }

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            transition: all 0.25s;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          transition: all 0.3s;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        justify-content: space-between;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 0.95;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>