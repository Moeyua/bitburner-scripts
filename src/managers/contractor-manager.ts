import { NS } from '@ns'
import { deepscan } from '/lib/helpers'
import solvers from '/lib/contractorSolvers'

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
  const reslover = solvers.find(reslover => reslover.name === type)
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


