import DataBus from '../databus'

const databus = new DataBus()
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const atlas = new Image()
atlas.src = 'images/pokers.png'

export default class Player {
  constructor() {
    this.sx = 0
    this.sy = 0
    this.score = 0
    this.finish = false
    this.myPokers = []
    this.myKoupai = []
  }
  init(sy) {
    this.sy = sy
  }
  playMyPoker() {
    console.log('wochupai %d',this.sy/40)
    for (var i=this.myPokers.length-1;i>=0;i--) {
      for (var j=0;j<databus.pokers.length;j++){
        if(databus.pokers[j].index == this.myPokers[i].index){
          if(databus.guidao[databus.pokers[j].index%4].isSuitable(databus.pokers[j].index)){
            databus.pokers[j].vis = true
            console.log('woxia %d',parseInt((databus.pokers[j].index)/4) + 1)
            this.myPokers.splice(i,1);
            databus.guidao[databus.pokers[j].index%4].getPoker(databus.pokers[j].index)
            return true
          }
        }
      }
    }
    return false
  }
  renderMyPoker(ctx) {
    for (var i=0;i<this.myPokers.length;i++) {
        this.myPokers[i].renderPokerToPlayer(ctx,this.sy,i)
    }
  }
  renderMyKoupai(ctx) {
    for (var i=0;i<this.myKoupai.length;i++) {
        this.myKoupai[i].renderPokerToPlayer(ctx,this.sy,i)
    }
  }
}
