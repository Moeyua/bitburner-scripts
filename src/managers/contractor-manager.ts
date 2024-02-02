import { NS } from '@ns'
import { deepscan } from '/lib/helpers'

interface Contract {
  file: string
  host: string
  type: string
  input: any
}

export function main(ns: NS) {
  const contracts = findContracts(ns)
  contracts.forEach(contract => {
    const result = resloveContract(ns, contract)

    ns.tprint(result)
  })
}

function findContracts(ns: NS) {
  const servers = deepscan(ns)
  const contracts: Contract[] = []
  servers.forEach(host => {
    ns.ls(host).forEach(file => {
      if (file.endsWith('.cct')) {
        const contractType = ns.codingcontract.getContractType(file, host)
        const contractInput = ns.codingcontract.getData(file, host)
        contracts.push({ file: file, host, type: contractType, input: contractInput })
      }
    })
  })
  return contracts
}

function resloveContract(ns: NS, contract: Contract) {
  const { host, file, type } = contract
  const reslover = reslovers.find(reslover => reslover.name === type)
  if (!reslover) {
    ns.tprint('No solver found for contract type: ' + type)
    return
  }
  const answer = reslover.solver(contract.input)
  const result = ns.codingcontract.attempt(answer, file, host)
  if (result === '') {
    ns.tprint('Contract ' + type + ' on ' + host + ' failed')
    return
  }
  return result

}


interface Reslover {
  name: string
  solver: (param: any) => any
}
const reslovers: Reslover[] = [
  {
    name: "Compression I: RLE Compression",
    solver: function (data: string) {
      return data.replace(/([\w])\1{0,8}/g, (group, chr) => group.length + chr)
    }
  },
  {
    name: 'Minimum Path Sum in a Triangle',
    solver: function (data: number[][]) {
      const n = data.length
      const dp = data[n - 1].slice()
      for (let i = n - 2; i > -1; --i) {
        for (let j = 0; j < data[i].length; ++j) {
          dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j]
        }
      }
      return dp[0]
    },
  },
  {
    name: 'Algorithmic Stock Trader II',
    solver: function (data: number[]) {
      let profit = 0
      for (let p = 1; p < data.length; ++p) {
        profit += Math.max(data[p] - data[p - 1], 0)
      }
      return profit.toString()
    },
  },
  {
    name: 'Unique Paths in a Grid I',
    solver: function (data: number[]) {
      const n = data[0] // Number of rows
      const m = data[1] // Number of columns
      const currentRow = []
      currentRow.length = n
      for (let i = 0; i < n; i++) {
        currentRow[i] = 1
      }
      for (let row = 1; row < m; row++) {
        for (let i = 1; i < n; i++) {
          currentRow[i] += currentRow[i - 1]
        }
      }
      return currentRow[n - 1]
    },
  },
  {
    name: 'Sanitize Parentheses in Expression',
    solver: function (data: string) {
      let left = 0
      let right = 0
      const res: string[] = []
      for (let i = 0; i < data.length; ++i) {
        if (data[i] === '(') {
          ++left
        } else if (data[i] === ')') {
          left > 0 ? --left : ++right
        }
      }

      function dfs(pair: number, index: number, left: number, right: number, s: string, solution: string, res: string[]) {
        if (s.length === index) {
          if (left === 0 && right === 0 && pair === 0) {
            for (let i = 0; i < res.length; i++) {
              if (res[i] === solution) {
                return
              }
            }
            res.push(solution)
          }
          return
        }
        if (s[index] === '(') {
          if (left > 0) {
            dfs(pair, index + 1, left - 1, right, s, solution, res)
          }
          dfs(pair + 1, index + 1, left, right, s, solution + s[index], res)
        } else if (s[index] === ')') {
          if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res)
          if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res)
        } else {
          dfs(pair, index + 1, left, right, s, solution + s[index], res)
        }
      }
      dfs(0, 0, left, right, data, '', res)

      return res
    },
  },
]



