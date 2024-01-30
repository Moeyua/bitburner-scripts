import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
  const serverLimit = ns.getPurchasedServerLimit()
  let serverNum = ns.getPurchasedServers().length
  const ram = Math.pow(2, 20)
  while (serverNum < serverLimit) {
    const name = ns.purchaseServer(`pserv-${serverNum}`, ram)
    ns.tprint(`Purchased server ${name}`)
    serverNum++
  }
}
