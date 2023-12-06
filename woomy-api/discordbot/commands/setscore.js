import {config} from "../config.js"

const settings = {
  description: "Sets the score of a player",
  arguments: ["entity id", "score amount"],
  allowedRoles: ["wrm", "overseerTrainee", "overseer", "supervisorTrainee", "supervisor", "admin", "developer"],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  if(args.length !== 2){
    bot.error(message, "There must be only two arguments present")
    return
  }
  if(isNaN(args[0]*1) || isNaN(args[1]*1)){
    bot.error(message, "Both arguments must be numbers")
    return
  }
  bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "setscore", {id:args[0], score:args[1]*0.1}, (d)=>{
    if(d.status === 1){
      bot.error(message, d.message)
    }else{
      let embed = bot.createEmbed()
      embed.setTitle("Successfully set score")
      embed.setDescription(d.message+"'s score is now "+args[1])
      bot.sendEmbed(message, embed)
    }
  })
}

export {settings, execute}