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
  }

  findFirst() {
    for (var i=0;i<databus.players.length;i++){
      databus.players[i].myPokers.forEach((poker) => {
        if (poker.index == 27){
          return i
        }
      })
    }
  }

  findMin() {
    var min = 50
    for (var i=0;i<databus.players.length;i++){
      min = Math.min(min, databus.players[i].myPokers.length)
    }
    return min
  }

  playGame() {
    var minNum = this.findMin()
    while(minNum != 0){
      var first = this.findFirst()
      
      minNum = this.findMin()
    }
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
      player.init(i*40)
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
    if (databus.gameOver) {
      databus.pokers.forEach((poker) => {
        if (poker.judge){
          if(databus.guidao[poker.index%4].isSuitable(poker.index)){
            poker.vis = true
            databus.players.forEach((player) => {
              for (var i=0;i<player.myPokers.length;i++){
                if(player.myPokers[i].index == poker.index){
                  player.myPokers.splice(i,1);
                }
              }
            })
            databus.guidao[poker.index%4].getPoker(poker.index)
          }
          poker.judge = false
        }
        if (poker.vis){
          poker.renderPokerToTable(ctx)
        }
      })
      databus.players.forEach((player) => {
        player.myPokers = player.myPokers.sort(this.cmp)
        player.renderMyPoker(ctx)
      })
    }
  }
  
  faPai2() {
    var arr = Array.from(databus.pokers)
    databus.players.forEach((player) => {
      while(player.myPokers.length != 13){
        player.myPokers.push(databus.pokers[Math.floor(Math.random()*10)])
      }
    })
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
