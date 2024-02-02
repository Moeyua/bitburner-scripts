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
  let isNegative = false;
  if (num < 0) {
    isNegative = true;
    num = -num;
  }

  while (num >= 1000 && i < symbols.length - 1) {
    num /= 1000;
    i++;
  }

  if (isNegative) {
    num = -num;
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
  if (maxMoney > 0) return true
  ns.print('Server max money is too small to hack')
  return false;
}

export async function killall(ns: NS) {
  const startingNode = ns.getHostname();
  const serverList = deepscan(ns);

  // Send the kill command to all servers
  for (const server of serverList) {
    // skip if this host, we save it for last
    if (server == startingNode)
      continue;

    // skip if not running anything
    if (ns.ps(server).length === 0)
      continue;

    // kill all scripts
    ns.killall(server);
  }

  // idle for things to die
  for (const server of serverList) {
    // skip if this host, we save it for last
    if (server == startingNode)
      continue;
    // idle until they're dead, this is to avoid killing the cascade before it's finished.
    while (ns.ps(server).length > 0) {
      await ns.sleep(20);
    }
    // Remove script files the daemon would have copied over (in case we update the source)
    for (const file of ns.ls(server, '.js'))
      ns.rm(file, server)
  }

  // wait to kill these. This kills itself, obviously.
  ns.killall(startingNode);
}

export async function waitTillCash(ns: NS, target: number) {
  ns.disableLog("sleep");
  ns.disableLog("getServerMoneyAvailable");
  if (ns.getServerMoneyAvailable("home") < target)
    ns.print(`Waiting for cash to reach ${target}`);
  while (ns.getServerMoneyAvailable("home") < target)
    await ns.sleep(5000);
}

export const SERVER_SPECIAL = [
  "home",
  "CSEC",
  "avmnite-02h",
  "I.I.I.I",
  ".",
  "run4theh111z",
  "darkweb",
]
