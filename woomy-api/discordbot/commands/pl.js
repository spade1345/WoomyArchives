import {config} from "../config.js"

const settings = {
  description: "Gets the player list for the game server",
  arguments: [],
  allowedRoles: [],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let embed = bot.createEmbed()
  embed.setTitle("Player list")
  bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "playerlist", {}, (d)=>{
    if(!d.length){
      embed.setDescription("There are no players in that server")
    }
    for(let player of d){
      embed.addFields({
        name: `${player.name} as a ${player.tank} with ${player.score} score`,
        value: `Discord: ${player.discord} | Socket Id: ${player.socketId} | Entity Id: ${player.entityId}`
      })
    }
    bot.sendEmbed(message, embed)
  })
}

export {settings, execute}