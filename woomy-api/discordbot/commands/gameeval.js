import {config} from "../config.js"

const settings = {
  description: "Runs an eval command in the game",
  arguments: ["code"],
  allowedRoles: ["developer"],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let code = args.join("").replaceAll("\`\`\`", "").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "")
  bot.sendToGame(message, bot.findLobbyIdFromPrefix(message.prefix), "eval", code, (d)=>{bot.error(message, d.message, d)})
  message.reply("Finished execution")
}

export {settings, execute}