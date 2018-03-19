import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

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

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取搜索历史

  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches) // 存储起来

  return searches
}

// 获取本地存储
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