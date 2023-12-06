import {config} from "../config.js"

const settings = {
  description: "Gets the link to the prefix's server",
  arguments: [],
  allowedRoles: [],
  globalUse: false,
  allowedGlobalRoles: [],
  devApiUse: false
}

const execute = (bot, message, args) => {
  message.reply(global.servers[bot.findLobbyIdFromPrefix(message.prefix)].gamelink)
}

export {settings, execute}