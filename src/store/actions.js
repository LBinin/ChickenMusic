import * as types from './mutation-types'
import { playMode } from 'common/lib/config'
import { shuffle } from 'common/lib/util'
import { saveSearch, deleteSearch, clearSearch } from 'common/lib/cache'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 点击歌曲播放当前歌单
export function selectPlay({ state, commit }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    // 随机模式下排序
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

// 插入歌曲
export function insertSong({ state, commit }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currIndex = state.currIndex
  // 记录当前歌曲
  let currSong = playlist[currIndex]
  // 查找当前列表是否有准备插入的歌曲
  let fpIndex = findIndex(playlist, song)
  // 插入歌曲
  playlist.splice(++currIndex, 0, song)

  // 当前歌单包含该歌曲
  if (fpIndex > -1) {
    // 存在待插入歌曲
    if (currIndex > fpIndex) {
      // 如果插入的地方在底部
      playlist.splice(fpIndex, 1)
      currIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currSequenceIndex = findIndex(sequenceList, currSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currSequenceIndex, 0, song)

  if (fsIndex > -1) {
    if (currSequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURR_INDEX, currIndex)
  commit(types.SET_FULL_SCREEN, true) // 进入全屏
  commit(types.SET_PLAYING_STATE, true) // 设置开始播放
}

// 保存搜索历史记录
export function saveSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除历史纪录
export function deleteSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空历史纪录
export function clearSearchHistory({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除歌单中的歌曲
export function deleteSong({ state, commit }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currIndex = state.currIndex

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currIndex > pIndex || currIndex === playlist.length) {
    currIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURR_INDEX, currIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空播放列表
export function deleteSongList({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURR_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}