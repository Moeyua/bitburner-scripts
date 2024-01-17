import { NS } from '@ns'
import { deepexec } from 'lib/helpers'

export async function main(ns: NS): Promise<void> {
  // ns.tail('main.js')
  // const servers = deepscan(ns);
  // servers.forEach(server => {
  //   const scripts = ["hack.js", "lib/helpers.js"];
  //   ns.scp(scripts, server);
  //   ns.exec('hack-manager.js', server);
  // })
  deepexec(ns, server => {
    const scripts = ["hack.js", "lib/helpers.js", 'hack-manager.js'];
    ns.print('scp', server);
    ns.scp(scripts, server);
    ns.exec('hack-manager.js', server);
  })

  ns.run('hacknet.js');
}

