import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.url = url
    this.name = name
    this.album = album
    this.image = image
    this.singer = singer
    this.duration = duration
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(data => {
        if (data.retcode === ERR_OK) {
          this.lyric = Base64.decode(data.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filtersSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=38`,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

/**
 * 用斜线合并歌手
 * @param {any} singer 歌手数组
 * @returns 结果字符串
 */
function filtersSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join(' / ')
}
