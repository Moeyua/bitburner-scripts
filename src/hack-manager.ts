import { NS } from '@ns'
import { deepexec } from 'lib/helpers'

export async function main(ns: NS): Promise<void> {
  // ns.tail('hack-manager.js')
  ns.killall();
  // const servers = deepscan(ns);
  // for (let i = 0; i < servers.length; i++) {
  //   const server = servers[i];
  //   ns.run('hack.js', 1, server);
  // }
  deepexec(ns, server => {
    ns.run('hack.js', 1, server);
  })
}
