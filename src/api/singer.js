import jsonp from 'common/lib/jsonp'
import { option } from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = {
    inCharset: 'utf8',
    outCharset: 'utf-8',
    format: 'json',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1
  }

  return jsonp(url, data, option)
}
