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

## 项目分析

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