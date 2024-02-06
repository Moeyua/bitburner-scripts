import { NS } from '@ns'
import { formatMoney } from '/lib/helpers'

export async function main(ns: NS) {
  const hasStockPermission = ns.stock.has4SData() ||
    ns.stock.has4SDataTIXAPI() ||
    ns.stock.hasTIXAPIAccess() ||
    ns.stock.hasWSEAccount()

  if (!hasStockPermission) return

  ns.tail()
  ns.disableLog('getServerMoneyAvailable')

  const symbols = ns.stock.getSymbols()
  const orders = new Set<string>(getOrders());

  ns.atExit(sellAllStock)

  while (true) {
    symbols.forEach(symbol => {
      const forecast = ns.stock.getForecast(symbol)
      if (forecast > 0.6 && !orders.has(symbol)) buyStock(symbol)
      else if (forecast < 0.5 && orders.has(symbol)) sellStock(symbol)
    })
    information()
    await ns.stock.nextUpdate()
  }

  function getOrders() {
    const res: string[] = []
    symbols.forEach(symbol => {
      const shares = ns.stock.getPosition(symbol)[0]
      if (shares > 0) res.push(symbol)
    })
    return res
  }

  function information() {
    let holding = 0
    let profit = 0
    orders.forEach(symbol => {
      const [shares, price] = ns.stock.getPosition(symbol)
      const cost = shares * price
      holding += cost
      const gain = ns.stock.getSaleGain(symbol, shares, 'Long')
      profit += (gain - cost)
    })
    const rate = Math.round((profit / holding) * 10000) / 100 + '%'
    ns.print(`cost: ${formatMoney(holding)}`)
    ns.print(`profit: ${formatMoney(profit)} (${rate})`)
  }

  function buyStock(symbol: string) {
    if (ns.getServerMoneyAvailable('home') < 1000000000) {
      ns.print('Not enough money')
      return
    }
    const maxShares = ns.stock.getMaxShares(symbol)
    const budget = ns.getServerMoneyAvailable('home') / 3
    const askPrice = ns.stock.getAskPrice(symbol)
    let shares = Math.floor(budget / askPrice)
    shares = Math.min(shares, maxShares)
    orders.add(symbol)
    ns.stock.buyStock(symbol, shares)
  }

  function sellStock(symbol: string) {
    const shares = ns.stock.getPosition(symbol)[0]
    ns.stock.sellStock(symbol, shares)
    orders.delete(symbol)
  }

  function sellAllStock() {
    orders.forEach(symbol => {
      const shares = ns.stock.getPosition(symbol)[0]
      ns.stock.sellStock(symbol, shares)
    })
    orders.clear()
  }
}
