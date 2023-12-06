import {config} from "../config.js"

const settings = {
  description: "Runs an eval command in the api",
  arguments: ["code"],
  allowedRoles: ["developer"],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {
  let code = args.join(" ").replaceAll("\`\`\`", "").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "")
  try{
    Promise.resolve(eval(code)).catch((e)=>{bot.error(message, "An error occured while running your code", e)})
  }catch(e){
    bot.error(message, "An error occured while running your code", e)
  }
  message.reply("Finished execution")
}

export {settings, execute}