import { Card, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { env } from '@config/environment'
import { ContractIds } from '@deployments/deployments'
import {
  SubstrateDeployment,
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import 'twin.macro'

export const BalanceContractInteraction: FC = () => {
  const router = useRouter()
  const { userId, platform, guildId, channelId } = router.query
  const { api, activeAccount } = useInkathon()
  const [adminContractAddress, setAdminContractAddress] = useState<string>()
  const [deployment, setDeployment] = useState<SubstrateDeployment>()

  useEffect(() => {
    const fetchAdminContractAddress = async () => {
      const response = await fetch(`https://api.op2.app/get-latest-message/${guildId}`)
      const data = await response.json()
      setAdminContractAddress(data.ContractIds)
    }

    fetchAdminContractAddress()
  }, [guildId])

  useEffect(() => {
    const getDeployment = async () => {
      const networks = env.supportedChains
      const deployments = []

      for (const network of networks) {
        if (adminContractAddress) {
          const deployment = {
            contractId: ContractIds.Greeter,
            networkId: network,
            abi: await import(`@inkathon/contracts/deployments/greeter/metadata.json`),
            address: adminContractAddress,
          }
          deployments.push(deployment)
        } else {
          console.error('Admin contract address is undefined.')
        }
      }

      setDeployment(deployments[0]) // Assuming there's only one network
    }

    if (adminContractAddress) {
      getDeployment()
    }
  }, [adminContractAddress]) // No need to destructure adminContractAddress here

  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Greeter)

  const [balance, setBalance] = useState<number>()
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [tokens, setTokens] = useState<any>()
  const [tokenUri, setTokenUri] = useState<string>()

  // Fetch Balance and Tokens
  const fetchBalanceAndTokens = async () => {
    console.log('fetchBalanceAndTokens called') // Log when the function is called

    if (!contract || !api || !activeAccount) {
      console.log('Missing contract, api, or activeAccount') // Log if any of these are missing
      return
    }

    setFetchIsLoading(true)
    try {
      const balanceResult = await contractQuery(
        api,
        activeAccount.address,
        contract,
        'PSP34::balance_of',
        {},
        [activeAccount.address],
      )

      const {
        output: balanceOutput,
        isError: balanceIsError,
        decodedOutput: balanceDecodedOutput,
      } = decodeOutput(balanceResult, contract, 'PSP34::balance_of')

      if (balanceIsError) throw new Error(balanceDecodedOutput)
      setBalance(balanceOutput)

      const tokensResult = await contractQuery(
        api,
        activeAccount.address,
        contract,
        'PSP34Enumerable::owners_token_by_index',
        {},
        [activeAccount.address, 0], // Assuming index 0 for example
      )

      // After determining the verification status...
      const verificationStatus = balanceOutput && balanceOutput > 0 ? 'VERIFIED' : 'ERROR'
      console.log('verificationStatus:', verificationStatus) // Log the verificationStatus

      // Send a POST request to your backend server
      if (userId) {
        console.log('Sending POST request to backend') // Log before sending the request
        fetch(`https://api.op2.app/verify/${platform}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies with the request
          body: JSON.stringify({
            userId: userId, // The Discord or Telegram user ID from the URL
            verificationStatus: verificationStatus,
            guildId: guildId,
            channelId: channelId,
          }),
        })
          .then((response) => {
            console.log('POST request response:', response) // Log the response
            return response.text()
          })
          .catch((error) => console.error('Error:', error))
      }

      const {
        output: tokensOutput,
        isError: tokensIsError,
        decodedOutput: tokensDecodedOutput,
      } = decodeOutput(tokensResult, contract, 'PSP34Enumerable::owners_token_by_index')

      if (tokensIsError) throw new Error(tokensDecodedOutput)
      setTokens(tokensOutput) // Set the tokens state
      // setTokens(tokensOutput) // You need to define a state for tokens
    } catch (e) {
      console.error('Error while fetching balance and tokens:', e)
      toast.error('Get REKT')
      setBalance(undefined)
      // setTokens(undefined) // You need to define a state for tokens
    } finally {
      setFetchIsLoading(false)
    }

    const tokenUriResult = await contractQuery(
      api,
      activeAccount.address,
      contract,
      'Psp34Traits::token_uri',
      {},
      [tokens?.Ok?.U64], // Use the token ID you fetched earlier
    )

    const {
      output: tokenUriOutput,
      isError: tokenUriIsError,
      decodedOutput: tokenUriDecodedOutput,
    } = decodeOutput(tokenUriResult, contract, 'Psp34Traits::token_uri')

    if (tokenUriIsError) throw new Error(tokenUriDecodedOutput)

    const tokenUriWithCorrectId = tokenUriOutput?.Ok?.String.replace(
      /0.json$/,
      `${tokens?.Ok?.U64}.json`,
    )

    setTokenUri(tokenUriWithCorrectId) // Set the tokenUri state
  }

  useEffect(() => {
    fetchBalanceAndTokens()
  }, [contract, activeAccount, tokenUri])

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Verification Process</h2>

        {/* Fetched Balance */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100" width="20rem">
          <FormControl>
            <FormLabel tw="text-center">STATUS</FormLabel>
            <Input
              tw="text-center"
              placeholder={
                fetchIsLoading
                  ? '...'
                  : !activeAccount
                  ? 'UNKNOWN'
                  : balance && balance > 0
                  ? 'VERIFIED'
                  : 'ERROR'
              }
              disabled={true}
              _disabled={{ paddingInlineStart: 0 }} // Add this line
            />
          </FormControl>
        </Card>

        {/* SAVE FOR LATER USE!!!!!!
        Fetched Token URI
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Fetched Token URI</FormLabel>
            <Input
              placeholder={fetchIsLoading ? 'Loading…' : tokenUri || 'No token URI'}
              disabled={true}
            />
          </FormControl>
        </Card>
      */}

        {/* 
        Fetched Tokens
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Fetched Tokens</FormLabel>
            <Input placeholder={fetchIsLoading ? 'Loading…' : tokens?.Ok?.U64} disabled={true} />
          </FormControl>
        </Card>
      */}

        {/* Contract Address */}
        {activeAccount && <p tw="text-center font-mono text-xs text-gray-600">{contractAddress}</p>}
      </div>
    </>
  )
}
