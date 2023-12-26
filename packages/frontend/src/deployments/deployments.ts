import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard',
}

export const getDeployments = async (contractAddress: string): Promise<SubstrateDeployment[]> => {
  // Check if contractAddress is valid
  if (!contractAddress) {
    console.error('Invalid contract address provided to getDeployments');
    return []; // Return an empty array or handle the error as appropriate
  }

  // Fetch the supported networks from the environment configuration
  const networks = env.supportedChains;

  // Map each network to a deployment configuration
  const deployments = networks
    .map(async (network) => [
      {
        contractId: ContractIds.Greeter, // Using the Greeter contract ID
        networkId: network, // Current network ID
        abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`), // Dynamically import the ABI for the contract
        address: contractAddress, // Contract address passed to the function
      },
    ])
    .reduce(async (acc, curr) => [...(await acc), ...(await curr)], [] as any); // Flatten the array of deployments

  return deployments;
}
