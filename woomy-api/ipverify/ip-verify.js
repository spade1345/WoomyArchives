import * as fs from "fs"
import fetch from "node-fetch";


export const ipChecker = (function(){
  const badIps = JSON.parse(fs.readFileSync("./ipverify/badIps.json")).ips
  const goodIps = JSON.parse(fs.readFileSync("./ipverify/goodIps.json")).ips
  function writeBadIp(ip, reason, note){
    console.log("Writting bad ip..",ip)
    removeBadIp(ip)
    badIps.unshift([ip, reason, note, new Date().toISOString().slice(0, 10)])
    fs.writeFileSync("./ipverify/badIps.json", JSON.stringify({ips:badIps}, null, "\t"))
  }
  function writeGoodIp(ip){
    console.log("Writting good ip..",ip)
    removeGoodIp(ip)
    goodIps.unshift(ip)
    fs.writeFileSync("./ipverify/goodIps.json", JSON.stringify({ips:goodIps}, null, "\t"))
  }
  function removeBadIp(ip){
    let write = false
    for(let i = 0; i < badIps.length; i++){
      if(badIps[i][0] === ip){
        badIps.splice(i, 1)
        write = true
        break
      }
    }
    if(write){
      fs.writeFileSync("./ipverify/badIps.json", JSON.stringify({ips:badIps}, null, "\t"))
    }
  }
  function removeGoodIp(ip){
    let index = goodIps.indexOf(ip)
    if(index === -1){
      return
    }
    goodIps.splice(index, 1)
    fs.writeFileSync("./ipverify/goodIps.json", JSON.stringify({ips:goodIps}, null, "\t"))
  }
  async function isBadIp(ip){
    for(let i = 0; i < badIps.length; i++){
      if(badIps[i][0] === ip){
        return badIps[i][1]
      }
    }
    
    if(goodIps.includes(ip)){
      return false
    }
    
    console.log(ip)
    let res = await fetch(`http://ip-api.com/json/${ip}?fields=isp,org,hosting,proxy`)
    res = await res.json()
    console.log(res)
    if(
      res.hosting || res.proxy
    ){
      writeBadIp(ip, "Automated bad ip detection, make sure you arent using a vpn/proxy (talk to a developer if this is a mistake)", `Hosting: ${res.hosting} | Proxy: ${res.proxy} | Org: ${res.org} | Isp: ${res.isp}`)
      return "Blacklisted ip org: "+res.org
    }
    
    writeGoodIp(ip)
    return false
  }
  return {
    writeBadIp,
    writeGoodIp,
    removeBadIp,
    removeGoodIp,
    isBadIp
  }
})()

