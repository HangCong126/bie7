import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }
  gitPokerNumber(index) {
    return parseInt(index/4) + 1;
  }
  gitPokerSuits(index) {
    return index%4;
  }
  reset() {
    this.frame = 0
    this.score = 0
    this.pokers = []
    this.players = []
    this.guidao = []
    this.animations = []
    this.gameOver = false
    this.gameRander = true
  }
}
