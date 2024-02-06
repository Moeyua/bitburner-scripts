import { NS } from '@ns'
import { killall, deepscan, syncFils } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  await killall(ns);
  const servers = deepscan(ns)
  servers.forEach(hostname => {
    syncFils(ns, hostname)
  })
  servers.forEach(host => {
    ns.exec('/managers/hack-manager.js', host);
  })

  ns.run('/managers/contractor-manager.js')
  ns.run('/managers/hacknet-manager.js');
  ns.run('/managers/stock-manager.js');
}
