import { NS } from '@ns'
import { deepexec, gainRootAccess, hasEnoughMoney, deepscan, SERVER_SPECIAL } from './helpers'

export async function main(ns: NS): Promise<void> {
  const hostname = ns.getHostname()
  const threads = calcThreads(ns, hostname)
  deepexec(ns, server => {
    if (!needHack(ns, server)) return
    ns.run('hack.js', threads, server);
  })
}

// 计算线程数
function calcThreads(ns: NS, server: string) {
  const serverFreeRam = ns.getServerMaxRam(server)
  const serverNum = deepscan(ns).length - SERVER_SPECIAL.length
  const scriptRam = ns.getScriptRam('hack.js')
  const hackRam = scriptRam * serverNum
  const threads = Math.max(1, Math.floor(serverFreeRam / hackRam))
  return threads
}

function needHack(ns: NS, server: string) {
  if (server === 'home') return false
  if (!hasEnoughMoney(ns, server)) return false
  if (!gainRootAccess(ns, server)) return false
  return true
}


