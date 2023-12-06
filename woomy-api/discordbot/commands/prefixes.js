import {getGamemodeInfo} from "../../index.js"
import {config} from "../config.js"
import fetch from "node-fetch"

const settings = {
  description: "Get a list of all the server prefixes",
  arguments: [],
  allowedRoles: [],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let embed = bot.createEmbed()
  embed.setTitle("Server Prefixes")
  embed.setDescription(`Gets the prefixes so you can use commands on that specific server by doing "<prefix>!<command>" example: "a!broadcast hey guys!"`)
  let hiddenLobbies = 0
  for(let lobbyId in global.servers){
    let server = global.servers[lobbyId]
    if(server.playerCount.current == 0){
      hiddenLobbies++
      continue;
    }
    embed.addFields({name:`${server.prefix}`, value:`${server.region} | ${server.gamemodeName} | ${server.playerCount.current}/${server.playerCount.max}`})
  }
  embed.setFooter({text:`${hiddenLobbies} Lobbies Hidden`})
  bot.sendEmbed(message, embed) 
}

export {settings, execute}