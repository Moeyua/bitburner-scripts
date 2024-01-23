import { NS } from '@ns'
import { formatMoney } from './lib/helpers'

export async function main(ns: NS) {
  ns.tail()
  ns.disableLog('getServerMoneyAvailable')

  const symbols = ns.stock.getSymbols()
  const orders = new Set<string>(getOrders());
  let sellProfit = 0

  // eslint-disable-next-line no-constant-condition
  while (true) {
    symbols.forEach(symbol => {
      const forecast = ns.stock.getForecast(symbol)
      if (forecast > 0.6 && !orders.has(symbol)) buyStock(symbol)
      else if (forecast < 0.5 && orders.has(symbol)) sellStock(symbol)
    })
    getCurrentProfit()
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

  function getCurrentProfit() {
    let profit = 0
    const cost = 0
    orders.forEach(symbol => {
      
      profit += getProfit(symbol)
    })
    ns.print('Current Profit:', formatMoney(profit))
    ns.print('Sell Profit:', formatMoney(sellProfit))
  }

  function getProfit(symbol: string) {
    const [shares, price] = ns.stock.getPosition(symbol)
    const cost = shares * price
    const gain = ns.stock.getSaleGain(symbol, shares, 'Long')
    const profit = (gain - cost)
    return profit
  }

  function buyStock(symbol: string) {
    if (orders.size >= 10) {
      ns.print('Max orders reached')
      return
    }
    if (ns.getServerMoneyAvailable('home') < 1000000) {
      ns.print('Not enough money')
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
    const profit = getProfit(symbol)
    sellProfit += profit
  }
}
