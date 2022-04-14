export default class GameInfo {
  constructor() {
    this.huase = 0
    this.big = 7
    this.small = 7
  }
  init(huase) {
    this.huase = huase
  }
  isSuitable(index) {
    if(index%4 != this.huase){
      return false
    }
    var num = parseInt((index)/4) + 1
    if(num == this.big){
      return true
    }
    if(num == this.small){
      return true
    }
    return false
  }
  getPoker(index) {
    var num = parseInt((index)/4) + 1
    if (num == this.small) {
      this.small--
    }
    if (num == this.big) {
      this.big++
    }
  }
}
