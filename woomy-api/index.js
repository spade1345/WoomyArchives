import express from "express"
import expressWs from "express-ws"
import cors from "cors"
import * as bodyParser from 'body-parser';
const server = express()
const wss = expressWs(server)
server.use(cors());
server.use(bodyParser.default.json());
import {ipChecker} from "./ipverify/ip-verify.js"
import {tokendata} from "./tokendata.js"
import {bot} from "./discordbot/index.js"
import {config} from "./discordbot/config.js"
let botConfig = config

server.get("/", function(req, res){
  res.send(`
    <script>window.location.href="https://woomy.app"</script>
  `)
})

/////// GAMEMODE ROTATION ///////
const gamemodes = [ // Each index = 1 day, 6 indexs = 1 week -- keep it that way
    ["dev",     "dev",     "dev",       "dev",     "dev",     "dev",       "dev"], // Development -- should never be public
    ["cavetdm", "mazetdm", "maze",      "cave",    "mazetdm", "maze",      "cave"],
    ["srvivl",  "ffa",     "srvivl",    "ffa",     "srvivl",  "ffa",       "srvivl"],
    ["4tdm",    "2tdm",    "4tdm",      "2tdm",    "4tdm",    "2tdm",      "4tdm"],
    ["boss",    "growth",  "crptTanks", "boss",    "growth",  "crptTanks", "testbed"], // ignore above, dev events on saturday woooooo
    ["sbx",     "sbx",     "sbx",       "sbx",     "sbx",     "sbx",       "sbx"], // Sandbox 
    ["sbx",     "sbx",     "sbx",       "sbx",     "sbx",     "sbx",       "sbx"] // Event server only 

]
const gamemodeLabels = [ // same as gamemodes
    ["Development","Development","Development","Development","Development","Development","Development"],
    ["Cave TDM","Maze TDM","Maze","Cave", "Maze TDM","Maze","Cave"],
    ["Survival","FFA","Survival","FFA","Survival","FFA","Survival"],
    ["4TDM","2TDM","4TDM","2TDM","4TDM","2TDM","4TDM"],
    ["Boss Rush","2TDM Growth","Corrupted Tanks","Boss Rush","2TDM Growth","Corrupted Tanks","Testbed Event"],
    ["Sandbox","Sandbox","Sandbox","Sandbox","Sandbox","Sandbox","Sandbox"],
    ["Event","Event","Event","Event","Event","Event","Event"]
]
const lobbyToNum = {0:0, a: 1,b: 2,c: 3,d: 4,e: 5,f: 6,g: 7,h: 8,i: 9,j: 10,k: 11,l: 12,m: 13,n: 14,o: 15,p: 16,q: 17,r: 18,s: 19,t: 20,u: 21,v: 22,w: 23,x: 24,y: 25,z: 26}
const numToLobby = ["0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "z", "y", "z"]
function getGamemodeInfo(server, day){
  return [gamemodes[lobbyToNum[server]]?.[day], gamemodeLabels[lobbyToNum[server]]?.[day]]
}
server.get("/rotationData", function(req,res){
  res.send(JSON.stringify({labels:gamemodeLabels, modes:gamemodes, day:new Date().getDay()}))
})

/////// PLAYER COUNT ///////
server.get("/allServers", function(req,res){
  let servers = []
  let day = new Date().getDay()
  for(let i = 0; i < gamemodeLabels.length; i++){
    servers.push({
      serverGamemode: gamemodeLabels[i][day],
      rivetGamemode: numToLobby[i],
    })
  }
  res.send(JSON.stringify({data:servers}))
})

/////// DISCORD OAUTH2 ///////
server.get("/discordOauth", function(req, res){
  bot.handleOauth.apply(this, arguments)
})

/////// WEBSOCKET ///////
// Main datas
global.servers = {}
global.websockets = new Map()
let callbackRequests = new Map()

// Callback requests
global.cbIds = 1
function newCallbackRequest(id,funct){
  callbackRequests.set(id, funct)
  setTimeout(()=>{
    callbackRequests.delete(id)
    //console.log("Deleted callback request due to timeout")
  }, 10000)
}
function doCallbackRequest(id, data){
  let funct = callbackRequests.get(id)
  if(!funct){
    return
  }
  funct(data)
  callbackRequests.delete(id)
}

// Prefixes
let savedDay = new Date().getDay()
let prefixNumber = 2
function generatePrefix(data={note:"No data provided"}){
  // Clear prefixes daily
  let currentDay = new Date().getDay()
  if(currentDay !== savedDay){
    savedDay = currentDay
    prefixNumber = 0
    global.servers = {}
    for(const [key, ws] of global.websockets){
      ws.close()
    }
  }
  
  // Generate a prefix and add it to the list
  let id = ""
  for(let i = prefixNumber; i > 0; i = ((i-1) / 26)|0){
    id = id+String.fromCharCode(64+((i % 26)||26));
  }
  global.servers[data.lobbyId] = data
  global.servers[data.lobbyId].prefix = (id+config.mainPrefix).toLowerCase()
  prefixNumber++
}

// Actual websocket
server.ws("/"+process.env.API_CONNECTION_KEY, (ws, req)=>{
  ws.talk = (data) => {
    if(ws.readyState !== 1){
      return
    }
    ws.send(JSON.stringify(data))
  }
  
  ws.on("message", async (data)=>{
    data = JSON.parse(data)
    
    let currentDay = new Date().getDay()
    switch(data.type){
        
      case "init": //// When a server connects
        // Setup the websocket and server data
        ws.lobbyId = data.data.lobbyId
        generatePrefix({
          lobbyId: data.data.lobbyId,
          region: data.data.region,
          gamemodeName: getGamemodeInfo(data.data.rivetGamemodeId, currentDay)[1],
          rivetGamemodeId: data.data.rivetGamemodeId,
          playerCount: {
            current: "0",
            max: data.data.maxPlayerCount
          }
        })
        global.websockets.set(ws.lobbyId, ws)
        
        // Tell the server what gamemode to be
        let gamemodePrefix = getGamemodeInfo(data.data.rivetGamemodeId, currentDay)[0]
        ws.talk({
          type: "forcedProfile",
          data: {
            okay: true,
            gamemode: gamemodePrefix
          }
        })
        global.servers[ws.lobbyId].gamemodePrefix = gamemodePrefix
        
        // Tell the server the tokendata
        ws.talk({
          type:"tokenData",
          data: tokendata
        })
        
        // Set the gamelink
        global.servers[ws.lobbyId].gamelink = `https://woomy.app/#${btoa(JSON.stringify({server:data.data.rivetGamemodeId, lobby: data.data.lobbyId, party:null}))}`
        bot.createNewInGameChannel(global.servers[ws.lobbyId])
      break;
        
      case "doILive": //// See if the server should still be up based on the gamemode rotation
          let isValid = "no";
          for (let arr of gamemodes) {
            if (arr[currentDay] !== data.data.mode) continue;
            isValid = "yes";
          }
          ws.talk({
            type: "doILive",
            data: isValid
          })
      break;
        
      case "updatePlayerCount": //// Update a servers playercount 
        let server = global.servers[ws.lobbyId]
        server.playerCount.current = data.data.count
      break;

      case "checkIp": //// See if an ip is banned or not
        let banReason = false//await ipChecker.isBadIp(data.data.ip)
        if(banReason){
          ws.talk({
            type: "badIp",
            data: {
              ip: data.data.ip,
              reason: banReason
            }
          })
        }
      break;
        
      case "response": //// Callback responses, acts like .then with post requests
        doCallbackRequest(data.id, data.data)
      break;
        
      default: //// Send to discord bot
        let event = await import("./discordbot/gameEvents/"+data.type+".js").catch((e)=>{})
        if(event){
          event.execute(bot, data, ws.lobbyId)
        }
      break;
        
    }
  })
  
  ws.on("close", ()=>{
    global.websockets.delete(ws.lobbyId)
    delete global.servers[ws.lobbyId]
    bot.cleanInGameChannels()
  })
  
  ws.on("error", ()=>{
    global.websockets.delete(ws.lobbyId)
    delete global.servers[ws.lobbyId]
    bot.cleanInGameChannels()
  })
})

// Ping all the servers every 30 seconds so the connection stays open
setInterval(()=>{
  for (const [key, value] of global.websockets) { // Using the default iterator (could be `map.entries()` instead)
    value.talk(JSON.stringify({type:"ping"}))
  }
}, 30000)

server.listen(3000, ()=>{
  console.log("Listening on port 3000")
});


export {getGamemodeInfo, newCallbackRequest}