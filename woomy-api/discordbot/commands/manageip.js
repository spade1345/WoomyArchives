import {ipChecker} from "../../ipverify/ip-verify.js"
import {config} from "../config.js"

const settings = {
  description: "Bans a player from the game via their ip",
  arguments: ["ip address", "ban/unban", "if banning, a reason"],
  allowedRoles: ["overseer", "supervisor", "admin", "developer"],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: false
}

const execute = (bot, message, args) => {
  if(args.length < 2){
    bot.error(message, "At least two arguments must be present")
    return
  }
  if(args[1] !== "ban" && args[1] !== "unban"){
    bot.error(message, "The second argument may only be \"ban\" or \"unban\"")
    return
  }
  
  let ip = args.shift()
  let method = args.shift()
  let reason = args.join(" ")
  
  if(method === "ban"){
    if(!reason){
      bot.error(message, "When banning an ip you must provide a reason")
      return
    }
    ipChecker.removeGoodIp(ip)
    ipChecker.writeBadIp(ip, reason)
    let embed = bot.createEmbed()
    embed.setTitle("Banned")
    embed.setDescription(`Sucessfully banned the provided ip with reason "${reason}"`)
    bot.sendEmbed(message, embed)
  }else if(method === "unban"){
    ipChecker.removeBadIp(ip)
    ipChecker.writeGoodIp(ip)
    let embed = bot.createEmbed()
    embed.setTitle("Unbanned")
    embed.setDescription("Sucessfully unbanned the provided ip")
    bot.sendEmbed(message, embed)
  }
}

export {settings, execute}