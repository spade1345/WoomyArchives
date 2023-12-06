import { Client, MessageEmbed } from "discord.js";
import fuzzysort from "fuzzysort";
import fs from "node:fs";
import { config } from "./config.js";
import fetch from "node-fetch";
import { newCallbackRequest } from "../index.js";
import * as url from "node:url";
export const bot = new Client({
  intents: 32767,
});
bot.presenceObject = {
  activities: [
    {
      type: "PLAYING",
      name: config.mainPrefix + "help | play.woomy.app",
      url: "https://woomy.app",
    },
  ],
  status: "idle",
};

///// BOT UTILS /////
bot.codeBlock = (lang, content) => {
  return `\`\`\`${lang}
${content}\n\`\`\``;
};
bot.jsonBlock = (jsonObj) => {
  return bot.codeBlock(
    "json",
    typeof jsonObj === "object" ? JSON.stringify(jsonObj, null, "\t") : jsonObj
  );
};
bot.error = (message, msg, error) => {
  let embed = bot.createEmbed();
  embed.setTitle("Error!");
  embed.setDescription(
    `${msg}\n` + (error ? bot.codeBlock("ansi", "\x1b[31m" + error.stack) : "")
  );
  embed.setColor("#FF0000");
  bot.sendEmbed(message, embed);
};
bot.createEmbed = () => {
  let embed = new MessageEmbed();
  embed.setColor(config.botColor);
  return embed;
};
bot.sendEmbed = (message, inputEmbed) => {
  // weird bug where this doesnt work, it should, lets just hope we never have more commands than the embed field limit, 25
  /*let embeds = []
  let i;
  for(let inital = i = Math.ceil(inputEmbed.fields.length/25); i > 0; i--){
    let embed = bot.createEmbed()
    embed.color = inputEmbed.color
    if(i === inital){ // Last embed
      embed.footer = inputEmbed.footer
      embed.timestamp = inputEmbed.timestamp
      embed.image = inputEmbed.image
      embed.vido = inputEmbed.vido
    }else if(i === 0){ // First embed
      embed.tite = inputEmbed.title
      embed.description = inputEmbed.description
      embed.url = inputEmbed.url
      embed.thumbnail = inputEmbed.thumbnail
      embed.author = inputEmbed.author
    }
    let index = 25*i
    inputEmbed.fields.splice(index-(index===-1?1:0), index+25).forEach(e=>embed.addFields(e))
    embeds.unshift(embed)
  }*/
  inputEmbed.setFooter("September 15, 2023.. Tick tock.")
  message.reply({ embeds: [inputEmbed] });
};
bot.getCommandEmbedField = (commandName) => {
  let details = bot.commandList[commandName];
  if (!details) return false;

  let textArgs = "";
  details.arguments.forEach((arg) => {
    textArgs += ` **<${arg}>**`;
  });

  let roles = "";
  for (let role of details.allowedRoles) {
    roles += ` <@&${config.roles[role]}>`;
  }
  if (!roles) roles = " @everyone";

  let globally;
  if (details.globalUse) {
    if (details.allowedGlobalRoles.length) {
      globally = "globally useable by";
      for (let role of details.allowedGlobalRoles) {
        globally += ` <@&${config.roles[role]}>`;
      }
    } else if (details.allowedRoles.length) {
      globally = "globally useable by";
      for (let role of details.allowedRoles) {
        globally += ` <@&${config.roles[role]}>`;
      }
    } else {
      globally = "globally useable by @everyone";
    }
  } else {
    globally = "not globally useable";
  }

  return [
    commandName + textArgs,
    `__${details.description}__.\n*${
      commandName[0].toUpperCase() + commandName.substr(1)
    } is ${globally} and can be used server-specifically by${roles}*`,
  ];
};
bot.findLobbyIdFromPrefix = (prefix) => {
  for (let key in global.servers) {
    let data = global.servers[key];
    if (data.prefix === prefix) {
      return key;
    }
  }
  return false;
};
bot.cleanInGameChannels = () => {
  let category = bot.channels.cache.get(config.ingameServersCategory);
  if (!category) return;
  for (let channel of category.children.values()) {
    let shouldDelete = true;
    for (let server in global.servers) {
      if (channel.id === global.servers[server]?.channel?.id) {
        shouldDelete = false;
        break;
      }
    }
    if (shouldDelete) channel.delete().catch(() => {});
  }
};
bot.sendToGame = (message, lobbyId, packetType, data, callback) => {
  let ws = global.websockets.get(lobbyId);
  if (!ws || ws.readyState !== 1 || !ws.talk) {
    global.websockets.delete(lobbyId);
    return;
  }

  let cdId;
  if (callback) {
    cdId = global.cbIds++;
    newCallbackRequest(cdId, callback);
  }

  ws.talk({
    callbackRequestId: cdId || null,
    type: "discord-" + packetType,
    data: data,
  });
};

///// BOT EVENTS /////
bot.on("ready", () => {
  // When the bot is ready
  bot.cleanInGameChannels();
  console.log("Discord bot ready"); // Log "Ready!"
});

bot.on("error", (err) => {
  console.error(err);
});

bot.createNewInGameChannel = async function (server) {
  let name = `${server.prefix.slice(
    0,
    -1 * config.mainPrefix.length
  )}-${server.gamemodePrefix.toLowerCase().split(" ").join("-")}`;
  let category = bot.channels.cache.get(config.ingameServersCategory);
  if (!category) return;

  // Create our channel
  category.guild.channels
    .create(name, {
      type: "text",
      topic: server.gamelink,
      parent: category,
      rateLimitPerUser: 10,
    })
    .then((channel) => {
      channel.send({
        content: "```=== SERVER INFORMATION ===```",
        embeds: [
          bot
            .createEmbed()
            .setThumbnail(bot.user.avatarURL())
            .setTitle(`New Game Channel`)
            .setDescription(
              `
**Region:** ${server.region}
**Gamemode:** ${server.gamemodeName}
**Prefix:** ${server.prefix}
**Gamelink:** [Click Here](${server.gamelink})
          `
            )
            .setColor(config.botColor),
        ],
      });
      channel.send("```=== MESSAGES/GAMECHAT ===```");
      server.channel = channel;
      bot.cleanInGameChannels();
    });
};

let lastCommand = 0;
bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "DM") return;
  if (!message.content) return;

  // Get the prefix and determine if its valid
  let prefix = message.content.split(config.mainPrefix);
  let prefixArr = prefix;

  if (!message.content.startsWith(config.mainPrefix) && prefix.length === 1) {
    // See if its in an in game chat channel
    for (let server in global.servers) {
      if (message.channel.id === global.servers[server]?.channel?.id) {
        bot.sendToGame(message, server, "chat", {
          text: `${message.author.username} says on discord: ${message.content}`,
        });
        return;
      }
    }
  }

  prefix = prefix[0] === "" ? config.mainPrefix : prefix[0] + config.mainPrefix;
  let validPrefix = false;
  if (prefix === config.mainPrefix) {
    validPrefix = true;
  } else {
    for (let server in global.servers) {
      if (prefix === global.servers[server].prefix) {
        validPrefix = true;
        break;
      }
    }
  }
  if (prefixArr.length === 1 || !validPrefix) {
    if (config.isDevApi) return;

    // Social credit system
    if (prefix.includes(" ")) prefix = prefix.split(" ")[0] + config.mainPrefix;

    if (
      (prefix.startsWith("=") ||
        prefix.startsWith("+") ||
        prefix.startsWith("-")) &&
      message.member.roles.cache.has(config.roles.developer) &&
      message.reference
    ) {
      let replied = await message.fetchReference();
      if (!replied) return;
      if (replied.member.roles.cache.has(config.roles.developer)) return;

      let value = Number(prefix.slice(1, -config.mainPrefix.length));
      if (isNaN(value) || value == undefined) return;

      let pointData = JSON.parse(
        fs.readFileSync("./discordbot/socialCredit.json")
      );
      if (!pointData[replied.author.id]) pointData[replied.author.id] = 0;

      if (prefix.startsWith("+")) {
        pointData[replied.author.id] += value;
      } else if (prefix.startsWith("-")) {
        pointData[replied.author.id] -= value;
      } else {
        pointData[replied.author.id] = value;
      }

      let embed = bot.createEmbed();
      embed.setTitle("Social credit change (" + prefix[0] + ")");
      embed.setDescription(
        `<@${replied.author.id}> now has ${
          pointData[replied.author.id]
        } social credit`
      );
      bot.sendEmbed(message, embed);

      fs.writeFileSync(
        "./discordbot/socialCredit.json",
        JSON.stringify(pointData)
      );
    }
    return;
  }
  message.prefix = prefix;

  lastCommand = Date.now();
  if (bot.presenceObject.status === "idle") {
    bot.presenceObject.status = "online";
    bot.user.setPresence(bot.presenceObject);
  }
  setTimeout(() => {
    if (Date.now() - lastCommand > 300000) {
      bot.presenceObject.status = "idle";
      bot.user.setPresence(bot.presenceObject);
    }
  }, 305000); // 5 mins and 5 seconds

  // Find the command
  let commandName = message.content.substring(prefix.length).split(" ")[0];
  let command = await import(
    "../discordbot/commands/" + commandName + ".js"
  ).catch((e) => {
    // Couldnt find the command, let the user know

    let embed = bot.createEmbed();
    embed.setTitle(`Could not find command \"${commandName}\"`);

    // Suggest possible commands the user mightve meant
    let sorted = fuzzysort.go(commandName, Object.keys(bot.commandList), {
      limit: 3,
    });
    let didYouMeanText = "";
    for (let obj of sorted) {
      if (!obj.target) continue;
      let data = bot.getCommandEmbedField(obj.target);
      embed.addFields({ name: data[0], value: data[1] });
    }

    // Decide the description based off if suggestions exist
    embed.setDescription(
      embed.fields.length
        ? "Did you mean one of the commands listed below?"
        : "Perhaps you have a typo?"
    );

    // Send our kid off to school
    message.reply({ embeds: [embed] });
  });
  if (!command) return;

  // See if we should and execute the command
  if (config.isDevApi && !command.settings.devApiUse) {
    bot.error(message, "That command cannot be used on the developer version");
    return;
  }
  if (prefix === config.mainPrefix) {
    if (!command.settings.globalUse) {
      let embed = bot.createEmbed();
      embed.setTitle("Global Use Issue");
      embed.setDescription(
        `"${commandName}" cannot be used globally. See ${config.mainPrefix}prefixes to get the server-specific prefixes.`
      );
      let data = bot.getCommandEmbedField(commandName);
      embed.addFields({ name: data[0], value: data[1] });
      bot.sendEmbed(message, embed);
      return;
    } else if (command.settings.allowedGlobalRoles.length) {
      let hasRole = false;
      for (let role of command.settings.allowedGlobalRoles) {
        if (message.member.roles.cache.has(config.roles[role])) {
          hasRole = true;
          break;
        }
      }
      if (!hasRole) {
        let embed = bot.createEmbed();
        embed.setTitle("Global Use Permissions Issue");
        embed.setDescription(
          `You dont have permission to use "${commandName}" globally`
        );
        let data = bot.getCommandEmbedField(commandName);
        embed.addFields({ name: data[0], value: data[1] });
        bot.sendEmbed(message, embed);
        return;
      }
    }
  }
  if (command.settings.allowedRoles.length) {
    let hasRole = false;
    for (let role of command.settings.allowedRoles) {
      if (message.member.roles.cache.has(config.roles[role])) {
        hasRole = true;
        break;
      }
    }
    if (!hasRole) {
      let embed = bot.createEmbed();
      embed.setTitle("Permissions Issue");
      embed.setDescription(`You dont have permission to use "${commandName}"`);
      let data = bot.getCommandEmbedField(commandName);
      embed.addFields({ name: data[0], value: data[1] });
      bot.sendEmbed(message, embed);
      return;
    }
  }

  // FIREEEE!!!!!!
  if (message.author.id === "889989767557693580" /*oblivion*/ || Math.random() < 0.0001) {
    message.reply("https://its-on-this-page.glitch.me");
    return;
  }
  let args = message.content.split(" ");
  args.shift();
  command.execute(bot, message, args);
});
bot.login(process.env.BOT_TOKEN).then((token) => {
  bot.user.setPresence(bot.presenceObject);
});

///// HELP COMMAND LIST /////
bot.commandList = {};
fs.readdirSync("./discordbot/commands").forEach(async (name) => {
  let parsedName = name.split(".")[0];
  let commandInfo = (await import("../discordbot/commands/" + name))[
    "settings"
  ];
  bot.commandList[parsedName] = commandInfo;
});

///// OAUTH2 /////
bot.handleOauth = async (req, res) => {
  const code = req.query.code;
  if (code) {
    let response = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new url.URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_SECRET_KEY,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: config.isDevApi ? "https://woomy-api-dev.glitch.me/discordOauth" : "https://woomy-api.glitch.me/discordOauth"
      }),
    })
    let data = await response.json()
    if(data.error||data.errors){
      res.send("Error signing in! Report this in the discord in the bug reports channel!\n"+JSON.stringify(data))
      return
    }
    res.send(`<script>window.location.href = "${config.isDevApi?("http://localhost:3001/?code="+data.access_token):("https://woomy.app/?code="+data.access_token)}"</script>`)
  }
};
