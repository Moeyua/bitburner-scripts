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

