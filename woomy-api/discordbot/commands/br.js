import {config} from "../config.js"

const settings = {
  description: "Sends a message to everyone in game",
  arguments: ["message"],
  allowedRoles: [],
  globalUse: true,
  allowedGlobalRoles: ["overseer", "supervisor", "admin", "developer"],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let msg = `${message.author.username} says on discord: ${args.join(" ")}`
  if(message.prefix === config.mainPrefix){
    for(let lobbyId in global.servers){
      bot.sendToGame(message, lobbyId, "broadcast", msg, (d)=>{
        message.react("✅")
      })
    }
  }else{
    bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "broadcast", msg, (d)=>{
      message.react("✅")
    })
  }
}

export {settings, execute}