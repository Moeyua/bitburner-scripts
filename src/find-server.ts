import { NS } from '@ns'

/**
 * run4theh111z
 */

function recursiveScan(ns: NS, parent: string, server: string, target: string, route: string[]): boolean {
  const children = ns.scan(server);
  for (const child of children) {
    if (parent === child) {
      continue;
    }
    if (child === target) {
      route.unshift(child);
      route.unshift(server);
      return true;
    }

    if (recursiveScan(ns, server, child, target, route)) {
      route.unshift(server);
      return true;
    }
  }
  return false;
}

export async function main(ns: NS) {
  const args = ns.flags([['help', false]]) as { _: string[], help: boolean };
  const route: string[] = [];
  const server: string = args._[0];
  if (!server || args.help) {
    ns.tprint("This script helps you find a server on the network and shows you the path to get to it.");
    ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);
    return;
  }

  recursiveScan(ns, '', 'home', server, route);

  ns.tprint(route)
  for (const server of route) {
    await ns.sleep(500);
    const extra = route.indexOf(server) > 0 ? "└ " : "";
    ns.tprint(`${" ".repeat(route.indexOf(server))}${extra}${server}`);
  }
}

export function autocomplete(data: { servers: string[] }, args: any): string[] {
  return data.servers;
}
