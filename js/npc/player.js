import DataBus from '../databus'

const databus = new DataBus()
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/pokers.png'

export default class Player {
  constructor() {
    this.id = 0
    this.sx = 0
    this.sy = 0
    this.score = 0
    this.finish = false
    this.myTurn = false
    this.isfirst = false
    this.firstIndex = 0
    this.myPokers = []
    this.myCovers = []
  }
  init(id) {
    this.id = id
    this.sy = id*40
  }
  deleteMyPoker(index) {
    this.myPokers.splice(index,1);
  }
  discardMyPoker() {
    var minNum = databus.gitPokerNumber(this.myPokers[0].index);
    var suits = databus.gitPokerSuits(this.myPokers[0].index);
    console.log('playerId: %d, discard the index %d',this.id, this.myPokers[0].index);
    console.log('playerId: %d, discard the number %d, suits: %d',this.id, minNum, suits);
    this.score += minNum;
    this.myCovers.push(this.myPokers[0])
    this.deleteMyPoker(0);
  }
  playMyPokerbyDatabusIndex(databusIndex) {
    for (var i=this.myPokers.length-1;i>=0;i--) {
      if(this.myPokers[i].index == databusIndex){
        this.playMyPokerbyIndex(i)
        return true
      }
    }
  }
  playMyPokerbyIndex(index) {
    var databusIndex = this.myPokers[index].index;
    var playNum = databus.gitPokerNumber(databusIndex);
    var suits = databus.gitPokerSuits(databusIndex);
    databus.pokers[databusIndex].vis = true
    console.log('playerId: %d, play the index %d',this.id, databusIndex);
    console.log('playerId: %d, play the number %d, suits: %d',this.id, playNum, suits);
    this.deleteMyPoker(index);
    databus.guidao[databusIndex%4].getPoker(databusIndex)
  }
  judgeMyPoker() {
    this.myTurn = false
    if(this.isfirst){
      console.log('playerId: %d is first',this.id)
      this.playMyPokerbyIndex(this.firstIndex)
      this.isfirst = false
      return true
    }
    for (var i=this.myPokers.length-1;i>=0;i--) {
      if(databus.guidao[this.myPokers[i].index%4].isSuitable(this.myPokers[i].index)){
        this.playMyPokerbyIndex(i)
        return true
      }
    }
    this.discardMyPoker();
  }
  renderMyPoker(ctx) {
    for (var i=0;i<this.myPokers.length;i++) {
        this.myPokers[i].renderPokerToPlayer(ctx,this.sy,i)
    }
  }
  rendermyCovers(ctx) {
    for (var i=0;i<this.myCovers.length;i++) {
        this.myCovers[i].renderPokerToPlayer(ctx,this.sy,i)
    }
  }
}
