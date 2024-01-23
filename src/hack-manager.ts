import { NS } from '@ns'
import { deepexec } from './lib/helpers'

export async function main(ns: NS): Promise<void> {
  ns.killall();
  let threads = 1
  const hostname = ns.getHostname()
  if (hostname === 'home') threads = 10
  deepexec(ns, server => {
    if (!needHack(ns, server)) return
    ns.run('hack.js', threads, server);
  })
}

function needHack(ns: NS, server: string) {
  if (server === 'home') return false
  if (!hasEnoughMoney(ns, server)) return false
  if (!hasRootAccess(ns, server)) return false
  return true
}

function hasRootAccess(ns: NS, server: string) {
  if (!ns.hasRootAccess(server)) {
    const level = ns.getServerRequiredHackingLevel(server);
    const port = ns.getServerNumPortsRequired(server);

    if (level > ns.getHackingLevel()) return false
    const fnStack = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
    try {
      for (let i = 0; i < port; i++) {
        fnStack[i](server);
      }
      ns.nuke(server);
    } catch (error) {
      ns.print(error);
    }
  }

  return ns.hasRootAccess(server)
}

function hasEnoughMoney(ns: NS, server: string) {
  const maxMoney = ns.getServerMaxMoney(server);
  if (maxMoney > 1000000) return true
  ns.print('Server max money is too small to hack')
  return false;

}
