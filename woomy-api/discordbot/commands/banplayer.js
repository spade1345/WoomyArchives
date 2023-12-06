import {ipChecker} from "../../ipverify/ip-verify.js"
import {config} from "../config.js"

const settings = {
  description: "Permanently bans a player from the game via their socketid (this cannot be easily undone)",
  arguments: ["socketid", "reason"],
  allowedRoles: ["overseer", "supervisor", "admin", "developer"],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: false
}

const execute = (bot, message, args) => {
  if(args.length < 2){
    bot.error(message, "There must be at least two arguments present")
    return
  }
  
  let socketid = args.shift()
  if(isNaN(Number(socketid))){
    bot.error(message, "The first argument must be a number")
    return
  }
  
  let reason = args.join(" ")
  
  bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "banplayer", {id:socketid, reason:reason}, (d)=>{
    if(d.status === 1){
      bot.error(message, d.message)
    }else{
      ipChecker.removeGoodIp(d.ip)
      ipChecker.writeBadIp(d.ip, reason)
      let embed = bot.createEmbed()
      embed.setTitle("Successfully banned socket "+socketid)
      embed.setDescription("This user is now permanently banned. To get them unbanned please message <@626735688595013645>")
      bot.sendEmbed(message, embed)
    }
  })
}

export {settings, execute}