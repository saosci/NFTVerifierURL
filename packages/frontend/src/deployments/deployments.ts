import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard',
}

export const getDeployments = async (guildId: string): Promise<SubstrateDeployment[]> => {
  const networks = env.supportedChains
  const deployments = []
  for (const network of networks) {
    const response = await fetch(`https://api.op2.app/get-latest-message/${guildId}`)
    const data = await response.json()
    const contractAddress = data.ContractIds
    deployments.push({
      contractId: ContractIds.Greeter,
      networkId: network,
      abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`),
      address: contractAddress,
    })
  }
  return deployments
}
