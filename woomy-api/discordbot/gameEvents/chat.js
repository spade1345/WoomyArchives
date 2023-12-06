import {config} from "../config.js"

const execute = (bot, data, serverId) => {
  const server = global.servers[serverId]
  let embed = bot.createEmbed()
  embed.setTitle("New Chat Message")
  embed.setDescription(`${data.data.name} ${data.data.discordId!==-1?`<@${data.data.discordId}>`:"No Discord Linked"}: ${data.data.text}`)
  embed.setFooter({text:`${server.region} | ${server.gamemodeName} | ${server.playerCount.current}/${server.playerCount.max} | ${server.prefix}`})
  server?.channel?.send?.({embeds:[embed]})
}

export {execute}