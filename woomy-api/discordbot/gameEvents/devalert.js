import {config} from "../config.js"

const execute = (bot, data, serverId) => {
  bot.channels.cache.get("1119637147343913061").send(JSON.stringify(data))
}

export {execute}
