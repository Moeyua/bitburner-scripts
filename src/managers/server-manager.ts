import { NS } from '@ns'
import { waitTillCash, syncFils } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  const args = ns.flags([['help', false]]) as { _: string[], help: boolean };
  const factor = parseInt(args._[0]);

  if (typeof factor !== 'number') return ns.tprint('Invalid input')

  const ram = Math.pow(2, factor)

  await upgradeServer(ram)
  await purchaseServer(ram)

  async function purchaseServer(ram: number) {
    const serverNum = ns.getPurchasedServers().length
    const serverLimit = ns.getPurchasedServerLimit()
    const cost = ns.getPurchasedServerCost(ram)
    for (let i = serverNum; i < serverLimit; i++) {
      await waitTillCash(ns, cost)
      const hostname = ns.purchaseServer(`pserv-${serverNum}`, ram)
      ns.tprint(`Purchased server ${hostname}`)
      startServer(hostname)
    }
  }

  async function upgradeServer(ram: number) {
    const serverNum = ns.getPurchasedServers().length
    for (let i = 0; i < serverNum; i++) {
      const cost = ns.getPurchasedServerUpgradeCost(`pserv-${i}`, ram)
      await waitTillCash(ns, cost)
      ns.upgradePurchasedServer(`pserv-${i}`, ram)
      ns.tprint(`Upgrading server pserv-${i} to ${ns.formatRam(ram)} RAM`)
    }
  }

  function startServer(hostname: string) {
    syncFils(ns, hostname)
    ns.exec('/managers/hack-manager.js', hostname);
  }
}
