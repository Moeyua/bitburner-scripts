import { NS } from '@ns'
import { gainRootAccess, hasEnoughMoney, deepscan } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  const hostname = ns.getHostname()
  let servers = deepscan(ns)
  servers = servers.filter(hostname => needHack(ns, hostname))
  const threads = calcThreads(ns, hostname, servers)
  servers.forEach((hostname => {
    ns.run('hack.js', threads, hostname);
  }))
}

// 计算线程数
function calcThreads(ns: NS, hostname: string, servers: string[]) {
  const serverFreeRam = ns.getServerMaxRam(hostname)
  const serverNum = servers.length
  const scriptRam = ns.getScriptRam('hack.js')
  const hackRam = scriptRam * serverNum
  const threads = Math.max(1, Math.floor(serverFreeRam / hackRam))
  return threads
}

function needHack(ns: NS, hostname: string) {
  if (hostname === 'home') return false
  if (!hasEnoughMoney(ns, hostname)) return false
  if (!gainRootAccess(ns, hostname)) return false
  return true
}


