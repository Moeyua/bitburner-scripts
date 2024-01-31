import { NS } from '@ns'
import { formatMoney, waitTillCash } from './helpers'

export async function main(ns: NS): Promise<void> {
  const serverLimit = ns.getPurchasedServerLimit()
  let serverNum = ns.getPurchasedServers().length
  ns.tprint(`Server limit: ${serverLimit}`)
  ns.tprint(`Current server number: ${serverNum}`)
  const ram = Math.pow(2, 20)
  const cost = ns.getPurchasedServerCost(ram)
  ns.tprint(`Server cost: ${formatMoney(cost)}`)
  while (serverNum < serverLimit) {
    await waitTillCash(ns, cost)
    const name = ns.purchaseServer(`pserv-${serverNum}`, ram)
    ns.tprint(`Purchased server ${name}`)
    serverNum++
  }
}
