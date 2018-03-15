import { playMode } from 'common/lib/config'

const state = {
  singer: {},
  playing: false, // 是否正在播放音乐
  fullScreen: false, // 播放列表是否全屏
  playlist: [], // 播放列表（可能是随机或者顺序）
  sequenceList: [], // 需要播放的列表
  mode: playMode.sequence, // 当前播放模式
  currIndex: -1 // 当前播放歌曲索引
}

export default state
