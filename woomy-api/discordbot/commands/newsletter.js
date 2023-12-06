import {config} from "../config.js"
import { readFileSync, writeFileSync } from "fs"

const settings = {
  description: "Sends out a newsletter to all those who have the role.",
  arguments: ["message"],
  allowedRoles: ["developer"],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: false
}

const execute = async (bot, message, args) => {
  if(args.length === 0){
    bot.error(message, "You must enter a message")
    return
  }
  
  let count = Number(readFileSync("./discordbot/newsletterCount.txt")) + 1
  writeFileSync("./discordbot/newsletterCount.txt", count.toString())
  
  let files = []
  for(let file of message.attachments){
    files.push(file[1])
  }
  
  let embed = bot.createEmbed()
  embed.setTitle(`Newsletter #${count} - <t:${Date.now().toString().slice(0, -3)}:f>`)
  embed.setDescription(args.join(" "))
  embed.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL()})
  
  let botMessage = await message.channel.send({embeds: [embed]})
  if(files.length)await message.channel.send({files: files})
  embed.setURL(botMessage.url)
  embed.setFooter({text:"Dont want to receive newsletters anymore? Unreact to the newsletter role in the roles channel."})
    
  let members = message.guild.roles.cache.get(config.roles.newsletter).members
  for(let [id, member] of members){
    member.send({embeds:[embed]}).catch(()=>{})
    if(files.length)member.send({files: files}).catch(()=>{})
  }
}

export {settings, execute}