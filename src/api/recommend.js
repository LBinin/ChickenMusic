import jsonp from 'common/lib/jsonp'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = {
    param: 'jsonpCallback'
  }

  return jsonp(url, {}, data)
}

export function getDiscList() {
  const url = '/api/getDiscList'
  const data = {
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    categoryId: 10000000,
    sin: 0,
    ein: 29
  }

  // 获取本地服务内容，见 webpack.dev.config.js
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 成功获取内容后返回一个 Promise
    return Promise.resolve(res.data)
  })
}