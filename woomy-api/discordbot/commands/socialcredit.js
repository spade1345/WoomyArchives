import {config} from "../config.js"
import {readFileSync, writeFileSync} from "fs"

const settings = {
  description: "Check your social credit ranking",
  arguments: ["position"],
  allowedRoles: [],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: true
}

const execute = (bot, message, args) => {  
  let forceStop = NaN;
  const obj = JSON.parse(readFileSync("./discordbot/socialCredit.json"))
  if(!obj[message.author.id]) obj[message.author.id] = 0
  
  const entries = Object.entries(obj);
  entries.sort((a, b) => b[1] - a[1]);
  
  forceStop = Number(args[0]) - 1
  
  let embed = bot.createEmbed()
  embed.title = "Social Credit Rankings"
  for(let i = 0; i < entries.length; i++){
    console.log(i, forceStop)
    if(forceStop && i !== forceStop) continue
    if(isNaN(forceStop) && entries[i][0] !== message.author.id) continue;
    
    for(let a = -2; a < 0; a++){
      if(entries[i+a]){
        embed.addFields({name:`#${i+a+1}${entries[i+a][0]===message.author.id?" <-- You":""}`, value:`*<@${entries[i+a][0]}>* with *${entries[i+a][1]}* social credit`})
      }
    }
    embed.addFields({name:`#${i+1}${entries[i][0]===message.author.id?" <-- You":""}`, value:`*<@${entries[i][0]}>* with *${entries[i][1]}* social credit`})
    for(let b = 1; b < 2+1; b++){
      if(entries[i+b]){
        embed.addFields({name:`#${i+b+1}`, value:`*<@${entries[i+b][0]}>* with *${entries[i+b][1]}* social credit`})
      }
    }
    break;
  }
    
  bot.sendEmbed(message, embed)
}

export {settings, execute}
