import { NS } from '@ns'

export function main(ns: NS) {
  const args = ns.flags([['help', false]]) as { _: string[], help: boolean };
  const server: string = args._[0];
  if (!ns.hasRootAccess(server)) {
    const level = ns.getServerRequiredHackingLevel(server);
    const port = ns.getServerNumPortsRequired(server);

    if (level > ns.getHackingLevel()) ns.tprint('Hacking level is too low')
    const fnStack = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
    try {
      for (let i = 0; i < port; i++) {
        fnStack[i](server);
      }
      ns.nuke(server);
    } catch (error) {
      ns.print(error);
    }
  }

  if(ns.hasRootAccess(server)) ns.tprint('Crack success')
  else ns.tprint('Crack failed')
}
