import { NS } from '@ns'
import { deepexec } from 'lib/helpers'

export async function main(ns: NS): Promise<void> {
  deepexec(ns, server => {
    const scripts = ["hack.js", "lib/helpers.js", 'hack-manager.js'];
    ns.print('scp', server);
    ns.scp(scripts, server);
    ns.exec('hack-manager.js', server);
  })

  ns.run('hacknet.js');
}

