import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },

  [types.SET_PLAYING_STATE](state, payload) {
    state.playing = payload
  },

  [types.SET_FULL_SCREEN](state, payload) {
    state.fullScreen = payload
  },

  [types.SET_PLAYLIST](state, payload) {
    state.playlist = payload
  },

  [types.SET_SEQUENCE_LIST](state, payload) {
    state.sequenceList = payload
  },

  [types.SET_MODE](state, payload) {
    state.mode = payload
  },

  [types.SET_CURR_INDEX](state, payload) {
    state.currIndex = payload
  },

  [types.SET_DISC](state, disc) {
    state.disc = disc
  },

  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },

  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },

  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },

  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
}

export default mutations
