import { NS } from '@ns'

export async function main(ns: NS) {
  ns.tail()
  ns.disableLog('getServerMoneyAvailable')

  const symbols = ns.stock.getSymbols()
  const orders = new Set<string>();
  getOrders()

  while (ns.getServerMoneyAvailable('home') > 1000000) {
    symbols.forEach(symbol => {
      const forecast = ns.stock.getForecast(symbol)
      if (forecast > 0.6 && !orders.has(symbol)) buyStock(symbol)
      else if (forecast < 0.5 && orders.has(symbol)) sellStock(symbol)
    })
    await ns.stock.nextUpdate()
  }

  function getOrders() {
    symbols.forEach(symbol => {
      const shares = ns.stock.getPosition(symbol)[0]
      if (shares > 0) orders.add(symbol)
    })
  }

  function buyStock(symbol: string) {
    if (orders.size >= 10) {
      ns.print('Max orders reached')
      return
    }
    const intendedPrice = ns.getServerMoneyAvailable('home') / 10
    const askPrice = ns.stock.getAskPrice(symbol)
    const shares = Math.floor(intendedPrice / askPrice)
    orders.add(symbol)
    ns.stock.buyStock(symbol, shares)
  }

  function sellStock(symbol: string) {
    orders.delete(symbol)
    const shares = ns.stock.getPosition(symbol)[0]
    ns.stock.sellStock(symbol, shares)
  }

}
