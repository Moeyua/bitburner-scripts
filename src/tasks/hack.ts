import { NS } from '@ns'

export async function main(ns: NS) {
  const args = ns.flags([['help', false]]) as {_: string[], help: boolean };
  const server = args._[0];

  while (true) {
    if (ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
      await ns.weaken(server);
    } else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
      await ns.grow(server);
    } else {
      await ns.hack(server);
    }
  }
}
