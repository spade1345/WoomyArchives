import {config} from "../config.js"

const execute = (bot, data) => {
  let embed = bot.createEmbed()
  embed.setTitle("New Record!")
  embed.addFields({
    name: "Gamemode",
    value: data.data.gamemode,
    inline: true
  })
  embed.addFields({
    name: "Tank",
    value: data.data.tank,
    inline: true
  },{
    name: "Discord/Name",
    value: data.data.discord,
    inline: true
  },{
    name: "Score",
    value: data.data.score+"",
    inline: true
  },{
    name: "Total Kills",
    value: data.data.totalKills+"",
    inline: true
  },{
    name: "Time Alive",
    value: data.data.timeAlive,
    inline: true
  })
  embed.setTimestamp(Date.now())
  bot.channels.cache.get(config.recordChannel).send({embeds:[embed]})
}

export {execute}