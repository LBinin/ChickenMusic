import * as types from './mutation-types'
import { playMode } from 'common/lib/config'
import { shuffle } from 'common/lib/util'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 点击歌曲播放当前歌单
export function selectPlay({ state, commit }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) { // 随机模式下排序
    let arr = JSON.parse(JSON.stringify(list))
    let randomlist = shuffle(arr)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURR_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击随机播放全部按钮播放乱序歌单
export function randomPlay({ state, commit }, { list }) {
  let arr = JSON.parse(JSON.stringify(list))
  let randomlist = shuffle(arr)
  commit(types.SET_PLAYLIST, randomlist) // 设置乱序歌单

  commit(types.SET_MODE, playMode.random) // 设置当前播放模式
  commit(types.SET_SEQUENCE_LIST, list) // 设置当前歌单
  commit(types.SET_CURR_INDEX, 0) // 从乱序歌单中的第一首开始
  commit(types.SET_FULL_SCREEN, true) // 进入全屏
  commit(types.SET_PLAYING_STATE, true) // 设置开始播放
}