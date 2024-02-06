import { NS } from '@ns'
import { formatMoney } from '/lib/helpers'

export async function main(ns: NS) {
  const serverLimit = ns.getPurchasedServerLimit()
  const serverNum = ns.getPurchasedServers().length
  ns.tprint(`Server limit: ${serverLimit}`)
  ns.tprint(`Current server number: ${serverNum}`)
  for (let i = 0; i <= 20; i++) {
    const ram = Math.pow(2, i)
    const cost = ns.getPurchasedServerCost(ram)
    ns.tprint(`${ns.formatRam(ram)} RAM(2**${i}) Server cost: ${formatMoney(cost)}`)
  }
}
