import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard',
}

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  const networks = env.supportedChains
  const deployments = networks
    .map(async (network) => [
      {
        contractId: ContractIds.Greeter,
        networkId: network,
        abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`),
        address: '5DMq6XZMLRLB3UjTktP5miotabFrjCss22TtrJhVAsRwBZfJ',
      },
    ])
    .reduce(async (acc, curr) => [...(await acc), ...(await curr)], [] as any)
  return deployments
}
