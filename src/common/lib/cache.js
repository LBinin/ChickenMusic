import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

/**
 * 向数组插入数据
 * @param {Array} arr 目标数组
 * @param {any} item 待插入数据
 * @param {Function} campare 比较函数；如何查找相同元素
 * @param {Number} maxLen 数组最大长度
 */
function insertArray(arr, item, campare, maxLen) {
  const index = arr.findIndex(campare)
  if (index === 0) {
    return
  }
  if (index > 0) { // 如果存在
    arr.splice(index, 1) // 删除数据
  }
  arr.unshift(item) // 在顶部插入数据

  if (maxLen && arr.length > maxLen) { // 超过最大长度删除最后一个
    arr.pop()
  }
}
/**
 * 删除数组中的元素
 * @param {any} arr 目标数组
 * @param {any} compare 删除对象
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存历史记录到本地
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取搜索历史

  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches) // 存储起来

  return searches
}

// 获取本地历史记录
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除历史记录
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取搜索历史

  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)

  return searches
}

// 清空历史记录
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存最近播放
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []) // 获取最近播放

  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)

  return songs
}

// 读取最近播放
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 添加到「我的收藏」
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])

  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)

  storage.set(FAVORITE_KEY, songs)

  return songs
}

// 取消收藏
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])

  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })

  storage.set(FAVORITE_KEY, songs)

  return songs
}

// 读取「我的收藏」
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}