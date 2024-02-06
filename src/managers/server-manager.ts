import { NS } from '@ns'
import { waitTillCash, syncFils } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  ns.tail()
  ns.atExit(() => ns.closeTail())
  ns.disableLog("sleep");
  ns.disableLog("getServerMoneyAvailable");
  
  for (let i = 20; i <= 20; i++) {
    const ram = Math.pow(2, i)
    await upgradeServer(ns, ram)
    await purchaseServer(ns, ram)
  }
}


async function purchaseServer(ns: NS, ram: number) {
  const serverNum = ns.getPurchasedServers().length
  const serverLimit = ns.getPurchasedServerLimit()
  const cost = ns.getPurchasedServerCost(ram)
  for (let i = serverNum; i < serverLimit; i++) {
    await waitTillCash(ns, cost)
    const hostname = ns.purchaseServer(`pserv-${serverNum}`, ram)
    ns.tprint(`Purchased server ${hostname}`)
    startServer(ns, hostname)
  }
}

async function upgradeServer(ns: NS, ram: number) {
  const serverNum = ns.getPurchasedServers().length
  for (let i = 0; i < serverNum; i++) {
    const hostname = `pserv-${i}`
    const cost = ns.getPurchasedServerUpgradeCost(hostname, ram)
    if (cost < 0) continue
    await waitTillCash(ns, cost)
    ns.upgradePurchasedServer(`pserv-${i}`, ram)
    ns.tprint(`Upgrading server pserv-${i} to ${ns.formatRam(ram)} RAM`)
    startServer(ns, hostname)
  }
}

function startServer(ns: NS, hostname: string) {
  const isExistsServer = ns.fileExists('hack-manager.js', hostname)
  if (!isExistsServer) syncFils(ns, hostname)
  else ns.killall(hostname)
  ns.exec('/managers/hack-manager.js', hostname);
}
