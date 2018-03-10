export default class Singer {
  /**
   * 创建歌手信息实例
   * @param {any} { id, name, size } id: Fsinger_mid, name: Fsinger_name, size: 头像大小
   * @memberof Singer
   */
  constructor({ id, name, size }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R${size}x${size}M000${id}.jpg?max_age=2592000`
  }
}