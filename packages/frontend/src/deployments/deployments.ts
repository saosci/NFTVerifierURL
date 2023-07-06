import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard',
}

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  const networks = env.supportedChains
  const contracts = Object.keys(env.nftContracts)
  const deployments = []

  for (const network of networks) {
    for (const contract of contracts) {
      const deployment = {
        contractId: ContractIds.Greeter,
        networkId: network,
        abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`),
        address: env.nftContracts[contract as keyof typeof env.nftContracts], // Assert `contract` as a key of `env.nftContracts`
      }
      deployments.push(deployment)
    }
  }

  return deployments
}
