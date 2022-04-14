const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/pokers.png'
const ctxa = canvas.getContext('2d')

export default class Poker {
  constructor() {
    this.x = 0
    this.y = 5
    this.width = 20
    this.height = 40
    this.index = 0
    this.vis = false
    this.judge = false
    this.initEvent()
  }
  init(index) {
    this.index = index
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 0

    return !!(x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation)
  }
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      if (this.checkIsFingerOnAir(x, y)) {
        console.log(this.index)
        this.judge = true
      }
    }))
  }
  renderPokerToTable(ctx) {
    this.x = screenWidth / 2 - 130 + 20*parseInt(this.index/4)
    this.y = screenHeight / 2 - 110 + (this.index%4)*40
    ctx.drawImage(
      atlas,
      2+40*this.index, 5, 38, 73,
      this.x,
      this.y,
      this.width, this.height
    )
  }
  renderPokerToPlayer(ctx, syy,idx) {
    this.x = screenWidth / 2 - 200 + 20*idx
    this.y = screenHeight / 2 + 60 + syy
    ctx.drawImage(
      atlas,
      2+40*this.index, 5, 38, 73,
      this.x,
      this.y,
      this.width, this.height
    )
  }
}
