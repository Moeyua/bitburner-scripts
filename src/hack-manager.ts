import { NS } from '@ns'
import { deepexec, gainRootAccess, hasEnoughMoney } from './helpers'

export async function main(ns: NS): Promise<void> {
  let threads = 1
  const hostname = ns.getHostname()
  if (hostname === 'home') threads = 100
  deepexec(ns, server => {
    if (!needHack(ns, server)) return
    ns.run('hack.js', threads, server);
  })
}

function needHack(ns: NS, server: string) {
  if (server === 'home') return false
  if (!hasEnoughMoney(ns, server)) return false
  if (!gainRootAccess(ns, server)) return false
  return true
}


