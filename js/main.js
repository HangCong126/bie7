import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Poker from './player/poker'
import Player from './npc/player'
import Music from './runtime/music'
import DataBus from './databus'

const ctx = canvas.getContext('2d')
const databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.cmp = function(a,b){
      return a['index'] - b['index']
    }

    this.restart()
    this.pokerGenerate()
    this.playerGenerate()
    this.guidaoGenerate()
    this.faPai()
    this.playGame()
  }
  
  guidaoGenerate() {
    for (var i=0;i<4;i++) {
      const guidao = new GameInfo()
      guidao.init(i)
      databus.guidao.push(guidao)
    }
  }
  
  playerGenerate() {
    for (var i=0;i<3;i++) {
      const player = new Player()
      player.init(i)
      databus.players.push(player)
    }
  }
  
  pokerGenerate() {
    for (var i=0;i<52;i++) {
      const poker = new Poker()
      poker.init(i)
      databus.pokers.push(poker)
    }
  }
  
  faPai() {
    var arr = Array.from(databus.pokers)
    var idx
    while(arr.length!=0) {
      for (var i=0;i<databus.players.length;i++){
        if(arr.length!=0) {
          idx = Math.floor(Math.random()*10)
          if(arr.length<10) {
            idx = arr.length - 1
          }
          databus.players[i].myPokers.push(arr[idx])
          arr.splice(idx,1);
        }
      }
    }
  }

  findFirst() {
    for (var i=0;i<databus.players.length;i++){
      for (var j=0;j<databus.players[i].myPokers.length;j++){
        if (databus.players[i].myPokers[j].index == 27){
          databus.players[i].myTurn = true
          databus.players[i].isfirst = true
          databus.players[i].firstIndex = j
          return true
        }
      }
    }
  }

  findMin() {
    var min = 50
    for (var i=0;i<databus.players.length;i++){
      min = Math.min(min, databus.players[i].myPokers.length)
    }
    return min
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async waitMyTurn() {
    var max = 0
    while(databus.players[0].myTurn){
      max++;
      if(max==20)return max;
      await this.sleep(1000);
      console.log('time remain:\n')
    }
  }

  async playGame() {
    this.findFirst()
    var playerNum = 3
    while(playerNum != 0){
      for (var i=0;i<databus.players.length;i++){
        await this.sleep(1000);
        var time = await this.waitMyTurn();
        if(time == 20){
          databus.players[i].discardMyPoker();
          databus.players[i].myTurn = false
        }
        if (databus.players[i].myTurn == true && databus.players[i].finish == false){
          databus.players[i].judgeMyPoker()
          databus.players[(i+1)%3].myTurn = true
        }
        if (databus.players[i].finish == false && databus.players[i].myPokers.length == 0){
          playerNum--
          databus.players[i].finish = true
        } else {
          databus.players[(i+1)%3].myTurn = true
        }
      }
    }
    databus.gameOver = true
    console.log('final score:\n')
    databus.players.forEach((player) => {
      console.log('player:%d, shoupai:%d, score %d.\n',player.sy/40,player.myPokers.length,player.score)
    })
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    // 游戏结束停止帧循环
    if (databus.gameRander) {
      databus.pokers.forEach((poker) => {
        if (poker.judge){
          if(databus.guidao[poker.index%4].isSuitable(poker.index)){
            databus.players[0].playMyPokerbyDatabusIndex(poker.index)
            databus.players[0].myTurn = false
          }
          poker.judge = false
        }
        if (poker.vis){
          poker.renderPokerToTable(ctx)
        }
      })
      databus.pokers.forEach((poker) => {
        if (poker.vis){
          poker.renderPokerToTable(ctx)
        }
      })
      for (var i=0;i<1;i++) {
        databus.players[i].myPokers = databus.players[i].myPokers.sort(this.cmp)
        databus.players[i].renderMyPoker(ctx)
      }
      if (databus.gameOver){
        databus.players.forEach((player) => {
          player.myCovers = player.myCovers.sort(this.cmp)
          player.rendermyCovers(ctx)
        })
      }
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
