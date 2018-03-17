// import jsonp from 'common/lib/jsonp'
import axios from 'axios'
import { commonParams } from './config'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    // callback: 'MusicJsonCallback_lrc',
    // pcachetime: '1521216111778',
    pcachetime: +new Date(),
    // jsonpCallback: 'MusicJsonCallback_lrc',
    songmid: mid
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      // 成功获取内容后返回一个 Promise
      return Promise.resolve(res.data)
    })
}