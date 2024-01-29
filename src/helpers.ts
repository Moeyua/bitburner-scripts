import { NS } from '@ns'

export function deepscan(ns: NS) {
  const serverSet = new Set(['home']);

  scan('home');

  function scan(host: string) {
    const servers = ns.scan(host);
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      if (serverSet.has(server)) continue
      serverSet.add(server)
      scan(server)
    }
  }

  return Array.from(serverSet)
}

// 深度执行函数
export function deepexec(ns: NS, fn: (server: string) => any) {
  const servers = deepscan(ns);
  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    fn(server);
  }
}

export function formatMoney(num: number): string {
  const symbols = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "e33", "e36", "e39"];
  let i = 0;
  while (num >= 1000 && i < symbols.length - 1) {
    num /= 1000;
    i++;
  }
  return num.toFixed(2) + symbols[i];
}

export function gainRootAccess(ns: NS, server: string) {
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

export function hasEnoughMoney(ns: NS, server: string) {
  const maxMoney = ns.getServerMaxMoney(server);
  if (maxMoney > 1000000) return true
  ns.print('Server max money is too small to hack')
  return false;

}
