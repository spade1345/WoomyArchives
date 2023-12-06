import {config} from "../config.js"

const settings = {
  description: "Gets the saved server data from the discord bot",
  arguments: [],
  allowedRoles: ["developer"],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  message.reply(bot.jsonBlock(global.servers))
}

export {settings, execute}