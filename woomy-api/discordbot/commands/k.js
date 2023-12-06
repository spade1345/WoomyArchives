import {config} from "../config.js"
import {readFileSync, writeFileSync} from "fs"

const settings = {
  description: "Makes the bot say k",
  arguments: [],
  allowedRoles: [],
  globalUse: true,
  allowedGlobalRoles: [],
  devApiUse: false
}

function generateK(text, maxSpaces){
  let string = "```\n";
  for(let i = maxSpaces-1; i > 0; i--){
    string += text + " ".repeat(i) + text + "\n"
  }
  for(let i = 0; i < maxSpaces; i++){
    string += text + " ".repeat(i) + text+ "\n"
  }
  return string+"\n```"
}

const execute = (bot, message, args) => {
  let count = Number(readFileSync("./discordbot/kCount.txt")) + 1
  writeFileSync("./discordbot/kCount.txt", count.toString())
  
  message.reply({content: generateK(count, 4), ephemeral: true})
}

export {settings, execute}