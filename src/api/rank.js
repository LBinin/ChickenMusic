import jsonp from 'common/lib/jsonp'
import { commonParams, option } from './config'

export function getRankList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    format: 'jsonp'
  })

  return jsonp(url, data, option)
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    // g_tk: 1695209883,
    // uin: 249781335,
    format: 'jsonp',
    // inCharset: utf-8,
    // outCharset: utf-8,
    // notice: 0,
    // platform: h5,
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid
    // _: 1521307621199
  })

  return jsonp(url, data, option)
}