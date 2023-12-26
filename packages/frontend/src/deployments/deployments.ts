import { env } from '@config/environment'
import { SubstrateDeployment } from '@scio-labs/use-inkathon'

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard',
}

export const getDeployments = async (contractAddress: string): Promise<SubstrateDeployment[]> => {
  console.log('getDeployments called with contractAddress:', contractAddress);

  // Fetch the supported networks from the environment configuration
  const networks = env.supportedChains;
  console.log('Supported networks:', networks);

  // Map each network to a deployment configuration
  const deploymentsPromises = networks.map(async (network) => {
    console.log('Processing network:', network);

    // Dynamically import the ABI for the contract
    const abi = await import(`@inkathon/contracts/deployments/greeter/metadata.json`);
    console.log('ABI loaded for network:', network, abi);

    return [{
      contractId: ContractIds.Greeter,
      networkId: network,
      abi: abi,
      address: contractAddress,
    }];
  });

  console.log('Deployment promises created:', deploymentsPromises);

  // Resolve all promises and flatten the array of deployments
  const deployments = await deploymentsPromises.reduce(async (acc, curr) => {
    const accumulated = await acc;
    console.log('Accumulated deployments so far:', accumulated);

    const current = await curr;
    console.log('Current deployment:', current);

    return [...accumulated, ...current];
  }, Promise.resolve([] as SubstrateDeployment[]));

  console.log('Final deployments:', deployments);

  return deployments;
}
