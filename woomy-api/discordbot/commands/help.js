import {config} from "../config.js"

const settings = {
  description: "Displays all of the bot commands",
  arguments: [],
  allowedRoles: [],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let embed = bot.createEmbed()
  embed.setTitle("Command List")
  for(let commandName in bot.commandList){
    let data = bot.getCommandEmbedField(commandName)
    embed.addFields({name:data[0], value:data[1]})
  }
  bot.sendEmbed(message, embed)
}

export {settings, execute}