import { NS } from '@ns'
import { gainRootAccess } from './helpers'

const servers = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']

export async function main(ns: NS): Promise<void> {
  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    const res = gainRootAccess(ns, server)
    if (res) {
      // ns.installBackdoor();
    }
    ns.print(`${server}: ${res}`);
  }
}

/**
 * [ ] Complete fl1ght.exe
 * Augmentations: 37 / 30
 * Money: $10.577b / $100b
 * Hacking skill: 1159 / 2500
 */
