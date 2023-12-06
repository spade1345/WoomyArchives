import {ipChecker} from "../../ipverify/ip-verify.js"
import {config} from "../config.js"

const settings = {
  description: "Kicks a player from a server, they will be able to immediately join back",
  arguments: ["socketid", "reason"],
  allowedRoles: ["overseer", "supervisor", "admin", "developer"],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: true
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
  
  bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "kickplayer", {id:socketid, reason:reason}, (d)=>{
    if(d.status === 1){
      bot.error(message, d.message)
    }else{
      let embed = bot.createEmbed()
      embed.setTitle("Successfully kicked socket "+socketid)
      embed.setDescription("This user has been kicked. They can join back at any time.")
      bot.sendEmbed(message, embed)
    }
  })
}

export {settings, execute}