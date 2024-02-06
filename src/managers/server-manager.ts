import { NS } from '@ns'
import { formatMoney, waitTillCash } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  const args = ns.flags([['help', false]]) as {_: string[], help: boolean };
  const inputRam = parseInt(args._[0]);

  if(typeof inputRam !== 'number') return ns.tprint('Invalid input')

  const serverLimit = ns.getPurchasedServerLimit()
  let serverNum = ns.getPurchasedServers().length
  ns.tprint(`Server limit: ${serverLimit}`)
  ns.tprint(`Current server number: ${serverNum}`)
  const ram = Math.pow(2, inputRam)
  const cost = ns.getPurchasedServerCost(ram)
  ns.tprint(`Server cost: ${formatMoney(cost)}`)
  while (serverNum < serverLimit) {
    await waitTillCash(ns, cost)
    const name = ns.purchaseServer(`pserv-${serverNum}`, ram)
    ns.tprint(`Purchased server ${name}`)
    serverNum++
  }
}
