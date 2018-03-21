## 项目介绍

**项目介绍**：

媲美原生移动端的音乐 APP ——「 **Chicken Music** 」

**功能介绍**：

- 歌手页面
- 歌手详情页
- 播放器内核
- 搜索页面
- 歌曲列表页面

**技术栈**：

Vue 全家桶

**项目结构**

项目分为两层：**业务层**和**支撑层**。

- 支撑层

    基于 MVVM 框架（ Vue.js 2.x ），配合基础组件库、状态管理 Vuex、路由管理 vue-router、服务端通讯 axios & jsonp 以及第三方插件。

    利用工具：vue-cli 初始化项目、webpack 自动化构建、ESLint 代码风格检查。

- 业务层

    推荐页面、歌手页面、歌手详情页面、播放器页面、歌单页面、排行榜页面、榜单列表页面、搜索页面、歌曲列表页面、用户中心页面。

共 13 个基础组件以及 15 个业务组件。

---

## 需求分析

🎧 顶部为 Logo + App 名称，右上角为个人中心入口。

🤔 顶部有 4 个 Tab 的导航栏，分别为：推荐、歌手、排行、搜索。

👍🏻 **推荐页面**

- **轮播图**，每个图片点击后会进行页面级别的跳转（ 多页面开发 ）。
- 整体为**推荐歌单列表**。
    - 点击对应歌单将会跳转至对应的**歌单详情页**
    - 歌单详情页顶部为**歌单图片**作为背景。
    - 顶部图片下方有一个**随机播放全部的按钮**（ 点击后将歌单内的歌曲顺序打乱后设为播放列表，并拉起播放界面 ）。
    - 下方是**歌曲列表页面**，点击后添加到当前歌曲列表并拉起播放界面。

🎤 **歌手页面**

- 右方为**类通讯录导航条**（ 点击字母快速导航到相应位置 ）。
- 整体为**歌手列表**，按「热门-姓氏排名」排序。
    - 点击后进入歌手详情列表，类似歌单列表。

🏆 **排行页面**

- 整体为**榜单列表**。
    - 点击排行列表中的元素后跳转到对应的**榜单详情页面**。

🔎 **搜索页面**

- 顶部**搜索框**用于搜索关键词或歌手，输入内容后检索并展示结果。
    - 如果点击的结果为**歌手**，则进入歌手详情页。
    - 如果点击的结果为**歌曲**，则添加至当前播放列表，并拉起播放页且开始播放。
- 搜索框下方为**热门搜索**，点击后将相应内容填入搜索框并显示结果。
- 热门搜索下方为**搜索历史**，点击后将相应内容填入搜索框并显示结果，每个元素提供删除按钮。

**播放器内核**

- 顶部为**歌曲名称**和**歌手名称**。
- 左上角为**缩小播放器按钮**。
- 中间为歌曲**相关图片**（ 随音乐播放转动，暂停时停止 ）。
- 图片下方为当前播放的**歌词**（ 仅一句 ）。
- 歌词下方有 **Page Point** 提示左右滑动翻页。
- Page Point 下方为**进度条**（ 可拖动控制歌曲进度 ），左边显示当前播放进度，右边为歌曲总时长。
- 底部为**功能按钮**：播放模式（ 列表顺序播放、单曲播放、随机播放 ）、上一首、播放/暂停、下一首、添加喜欢/取消喜欢。
- 左划后为**歌词页面**（ 随歌曲进度滚动 ）。
- 缩小后为 **mini 播放器**（ 位于各个页面的底部 ）：
    - mini 播放器左半边为：歌曲相关图片、歌曲名称、歌手名称
    - 右半边为：播放/暂停按钮（ 按钮周边随当前音乐进度显示环形进度条 ）、查看当前播放列表。

**播放列表**

- 整体为悬浮状态（ 悬浮于进入前所在页面 ）。
- **点击任何半透明区域**，都会关闭浮悬播放列表。
- 顶部左半边为**切换模式按钮**。
- 顶部右半边为**清空播放列表按钮**（ 点击后弹出确认对话框 ）。
- 下方整体为**播放列表**。
    - 每个元素右边均有：添加喜欢/取消喜欢、将歌曲移除播放列表，两个按钮。
- 列表下方为**添加歌曲队列按钮**（ 点击后进入添加歌曲列表页面 ）。
- 底部为**关闭浮悬播放列表按钮**。
- 点击对应歌曲后将进入**歌曲列表**，并拉起播放页且播放对应歌曲。

**添加歌曲列表页面**

- 标题下方为**搜索框**。
- 搜索框下方为**类别切换按钮**：最近播放、搜索历史（ 默认为最近播放 Tab ）。
- 最近播放下方为**歌曲列表**，点击后将对应歌曲添加至当前播放列表，并拉起播放页。
- 搜索历史下方为**历史记录列表**，点击对应元素后添加内容到搜索框内，并检索显示结果，和搜索页面类似。

**用户中心**

- 顶部左半边为**返回按钮**。
- 顶部有两个 **Tab 标签**：我喜欢的、最近听过。
- Tab 下方为**随机播放全部按钮**（ 点击后以当前列表作为播放列表 ）。
- 按钮下方为**歌曲列表**，点击后将对应歌曲添加至当前播放列表，并拉起播放页且播放对应歌曲。

**空白页面**

- 存在于搜索无结果、无收藏歌曲等场景。
- 均为 Logo + 对应提示。

---

## 起步

安装 **vue-cli**：

```Bash
$ npm install -g @vue/cli-init
```

下载模板并启动：

```Bash
$ vue init webpack chicken-music
$ cd chicken-music
$ npm i
$ npm run dev
```

---

## 项目笔记

### 目录结构

一般在 `src` 目录下编写代码，结构：

<pre>
├── src
    ├── api #存放与后端交互相关代码
    ├── common #存放通用静态资源，如字体文件、图片、通用 JS 库、样式文件
    ├── base #存放基础组件
    ├── components #存放业务组件
    ├── router #存放路由相关文件
    ├── store #存放 Vuex 相关代码
    ├── base
    ├── main.js #入口文件
    └── App.vue
</pre>

---

### 插件

安装 `babel-polyfill`、`babel-runtime` 和 `fastclick`。

```Bash
$ npm i --save-dev babel-polyfill
$ npm i --save babel-runtime fastclick
```

- `babel-polyfill` 主要对 ES6 API 进行转译。
- `babel-runtime` 对 JS 进行语法转译，不需要引入。
- `fastclick` 针对移动端解决 300ms 延迟问题。

在引入的时候将 `import 'babel-polyfill'` 放在最顶部，`fastclick` 需要 attach 到 HTML 文档的 `<body>` 上，这样 `body` 下所有元素都将取消 300ms 的延迟：

```JavaScript
import 'babel-polyfill'
import fastclick from 'fastclick'

fastclick.attach(document.body)
```

---

在引入资源的时候一般不写相对路径如 `./components/...` 而是写 `components/...` 但是如果恰好不是相对路径，构建的时候就会报错。这时候我们可以通过修改 `webpack.base.conf.js` 中的 `resolve.alias` 去设置别名：

```JavaScript
// webpack.base.conf.js
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      // 设置别名
      'src': resolve('src'),
      'common': resolve('src/common'),
      'components': resolve('src/components'),
      // ...
    }
  }
}
```

通过上面设置后，便可以在任何地方都使用 `components/...` 这样的方式啦~

---

jsonp 原理以及简单实现：

实际上就是利用 `<script>` 标签的 `src` 属性实现的跨域，由于 `src` 是 URL，所以 JSONP 跨域只支持 GET 方法。

具体步骤就是：通过 URL 将一个方法名称传送给服务端，服务端接收到该方法名称后放回一个 JavaScript 脚本，内容就是：通过 URL 中接收到的方法名称，使用干方法，将数据当做该方法的参数，调用该函数。

例如：前端添加了一个 `src` 为 `http://example.com?callback=getdata`，服务端接收到了 `callback` 的参数 `getdata`，将数据 `data` 以字符串的方式拼接成：

```JavaScript
getdata({ /* data 内容 */ })
```

由于是 `<script>` 标签，所以相当于前端本地会调用该函数以获取到内容。

详细介绍：[jsonp的原理与实现 - Segmentfault](https://segmentfault.com/a/1190000007665361)

---

在 `.vue` 中的 `<style lang="stylus">` 标签中引入其他文件的时候使用的是：`@import '~common/stylus/...'`。

`common` 在 `webpack.base.config.js` 中的 `resolve.alias` 中已经配置成绝对路径。

关于 URL 前的 `~` 波浪号，是告诉 webpack 这是一个绝对路径。因为在 `<style>` 标签中所使用的 loader 与 `<script>` 标签使用的 loader 不一样，不加 `~` 号的话会被识别成相对路径以至于无法找到资源。

---

通常如果需要保证前端 DOM 渲染完成的话，可以在 `mounted` 方法中，用 `setTimeout` 设置一个 20ms 的延迟，这是一个经验值，因为一般浏览器的刷新频率是 17ms 一次。

---

由于 vue-cli 更新到 v2.9 之后，发生了一些变化，在 `build/` 文件夹下没有了 `dev-sever.js` 和 `dev-client.js` 两个文件，那么启动接口服务就需要在 `webpack.dev.config.js` 中的 `devServer` 字段下进行配置：

```JavaScript
// webpack.dev.config.js
const devWebpackConfig = merge(baseWebpackConfig, {
  // ...
  devServer: {
    // ...
    before(app) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' })
      })
    }
  }
}
```

参考资料：

[vue-cli加载不到dev-server.js的解决办法](https://segmentfault.com/a/1190000012133507)

[新版 vue-cli 2.9.1的webpack的存在问题解决](https://segmentfault.com/a/1190000012060181)

---

需要回调的地方尽量使用 Promise。

---

`methods` 中推荐各种方法的位置：公共方法、监听事件放上方，私有方法放下方（ 一般在私有方法函数名前加 `_` 下划线 ）

---

Vue 深拷贝对象可以通过 `JSON.parse(JSON.stringify(...))` 来得到。

参考资料：[API - data | Vue.js](https://cn.vuejs.org/v2/api/#data)

---

如果有多个组件需要写相同的逻辑，推荐使用 Mixin （ 一次书写，多处引用 ）

---

上下半透明遮罩：

```css
.container {
    -webkit-mask-image: linear-gradient(to bottom,rgba(255,255,255,0) 0,rgba(255,255,255,.6) 15%,rgba(255,255,255,1) 25%,rgba(255,255,255,1) 75%,rgba(255,255,255,.6) 85%,rgba(255,255,255,0) 100%)
}
```

---

`<transition name="fade">` 标签中的内容，比如 `<p v-show="show">***</p>` 如果设置了 `.fade-enter-active, .fade-leave-active` 有过渡时间，那么 `v-show` 或者 `v-if` 会在适当的时机加入：也就是在动画前显示，动画后消失。

赞一个~

---

节流函数

```JavaScript
// 节流函数
export function debounce(callback, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}
```

---

什么事件该由什么**组件**执行就写在哪，别混淆。

---

如果使用的是 `JSON.parse(JSON.stringify(Obj))` 复制对象的话会失去对象原本定义在原型上的方法。

踩坑：在开发中使用了 `JSON.parse(JSON.stringify(Obj))` 来复制对象，结果对象的原型方法一直调用失败，也就是

```JavaScript
class song {
  constructor() {
    // ...
  }

  getLyric() {
    // 这个方法调用失败
  }
}

let obj = new song(/* param */)
let obj2 = JSON.parse(JSON.stringify(Obj))

obj2.getLyric() // obj2.getLyric is not a function
```

在 `vue-devtool`一步步的找，调试的时候发现对象内容其实没有变，应该是内容复制了，但是已经没有了 `getLyric` 方法，那么为什么会没有呢？应该只有一个原因了：这个对象已经不是 `song` 的实例了。所以，果断换成 `obj.slice()` 来复制对象，解决~ 👌🏻

---