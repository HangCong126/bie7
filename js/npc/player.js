const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/pokers.png'

export default class Player {
  constructor() {
    this.sx = 0
    this.sy = 0
    this.myPokers = []
  }
  init(sy) {
    this.sy = sy
  }
  renderMyPoker(ctx) {
    for (var i=0;i<this.myPokers.length;i++) {
        this.myPokers[i].renderPokerToPlayer(ctx,this.sy,i)
    }
  }
}
