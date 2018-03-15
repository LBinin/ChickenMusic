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
  }
}

export default mutations
