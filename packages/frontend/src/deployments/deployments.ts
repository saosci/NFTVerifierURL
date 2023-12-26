import { env } from '@config/environment';
import { SubstrateDeployment } from '@scio-labs/use-inkathon';

export enum ContractIds {
  Greeter = 'launchpad_psp34_nft_standard', // Your contract ID
}

export const getDeployments = async (contractAddress: string): Promise<SubstrateDeployment[]> => {
  const networks = env.supportedChains;
  const deployments: SubstrateDeployment[] = [];

  for (const networkId of networks) {
    // Assuming you want to use the same contract address for each network
    const abi = await import(`../../packages/contracts/deployments/${ContractIds.Greeter}/metadata.json`);

    deployments.push({ 
      contractId: ContractIds.Greeter, 
      networkId, 
      abi, 
      address: contractAddress // Using the passed contractAddress
    });
  }

  return deployments;
};
