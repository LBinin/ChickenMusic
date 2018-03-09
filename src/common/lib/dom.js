/**
 * 为元素添加类名
 * @export
 * @param {any} el 需要添加类名的元素
 * @param {any} className 需要添加的类名
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 检测元素是否有对应类名
 * @export
 * @param {any} el 需要检测的元素
 * @param {any} className 需要判断的类名
 * @returns {Boolean} 返回是否包含指定类名
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}