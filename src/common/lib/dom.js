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

/**
 * 获取元素上的 data-* 值
 * @export
 * @param {any} el 目标元素
 * @param {any} name data-* 后缀
 * @param {any} val 如果为空表示获取，否则为设置
 * @returns 视情况
 */
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

/**
 * 检测浏览器支持前缀
 * @export
 * @param {String} style 样式名称
 * @returns 样式全称
 */
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()
