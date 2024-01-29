import { NS } from '@ns'
import { deepexec, killall } from './helpers'

export async function main(ns: NS): Promise<void> {
  await killall(ns);
  deepexec(ns, server => {
    const scripts = ["hack.js", "helpers.js", 'hack-manager.js', 'server-crack.js'];
    ns.print('scp', server);
    scripts.forEach(script => {
      if(server === 'home') return
      ns.rm(script, server);
    })
    ns.scp(scripts, server);
    ns.exec('hack-manager.js', server);
  })

  ns.run('hacknet.js');
  ns.run('stock-manager.js');
  ns.run('milestones.js');
}

