import { NS } from '@ns'
import {  killall, deepscan } from '/lib/helpers'

export async function main(ns: NS): Promise<void> {
  await killall(ns);
  const servers = deepscan(ns)
  syncFils(ns)
  servers.forEach(host=>{
    ns.exec('/managers/hack-manager.js', host);
  })

  ns.run('/managers/contractor-manager.js')
  ns.run('/managers/hacknet-manager.js');
  ns.run('/managers/stock-manager.js');
}

function syncFils(ns: NS) {
  const servers = deepscan(ns)
  servers.forEach(host => {
    const scripts = ns.ls('home').filter(file => file.endsWith('.js'))
    scripts.forEach(script => {
      if (host === 'home') return
      ns.rm(script, host);
    })
    ns.scp(scripts, host);
  })
}
