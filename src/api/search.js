import { commonParams, option } from './config'
import jsonp from 'common/lib/jsonp'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams)

  return jsonp(url, data, option)
}

export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign({}, commonParams, {
    w: query,
    zhidaqu: 1,
    catZhida: zhida,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    format: 'jsonp',
    remoteplace: 'txt.mqq.all'
    // _: 1521312006024
  })

  return jsonp(url, data, option)
}