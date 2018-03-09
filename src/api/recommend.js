import jsonp from 'common/lib/jsonp'
import { options } from './config'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  return jsonp(url, {}, options)
}