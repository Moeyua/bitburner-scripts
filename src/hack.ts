import { NS } from '@ns'

export async function main(ns: NS) {
  const args = ns.flags([['help', false]]) as {_: string[], help: boolean };
  const server = args._[0];

  if (server === 'home') return

  if (!getRootAccess(server)) return

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
      await ns.weaken(server);
    } else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
      await ns.grow(server);
    } else {
      await ns.hack(server);
    }
  }

  function getRootAccess(server: string) {
    if (!ns.hasRootAccess(server)) {
      const level = ns.getServerRequiredHackingLevel(server);
      const port = ns.getServerNumPortsRequired(server);

      if (level > ns.getHackingLevel()) return false
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

    return ns.hasRootAccess(server)
  }
}
