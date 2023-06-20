import { SupportedChainId } from '@azns/resolver-core'
import { useResolveAddressToDomain } from '@azns/resolver-react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { env } from '@config/environment'
import { InjectedAccount } from '@polkadot/extension-inject/types'
import { encodeAddress } from '@polkadot/util-crypto'
import {
  SubstrateChain,
  allSubstrateWallets,
  getSubstrateChain,
  isWalletInstalled,
  useBalance,
  useInkathon,
} from '@scio-labs/use-inkathon'
import { truncateHash } from '@utils/truncateHash'
import { useIsSSR } from '@utils/useIsSSR'
import Image from 'next/image'
import { useRouter } from 'next/router'
import aznsIconSvg from 'public/icons/azns-icon.svg'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { AiOutlineCheckCircle, AiOutlineDisconnect } from 'react-icons/ai'
import { FiChevronDown, FiExternalLink } from 'react-icons/fi'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { black } from 'tailwindcss/colors'
import 'twin.macro'

export interface AccountNameProps {
  account: InjectedAccount
}
export const AccountName: FC<AccountNameProps> = ({ account, ...rest }) => {
  const { activeChain } = useInkathon()
  const { primaryDomain } = useResolveAddressToDomain(
    activeChain?.network === SupportedChainId.AlephZeroTestnet ? account?.address : undefined,
    {
      chainId: activeChain?.network,
    },
  )

  return (
    <Text
      fontSize="sm"
      fontFamily="mono"
      fontWeight="bold"
      textTransform="uppercase"
      display="flex"
      letterSpacing={-0.25}
      alignItems="baseline"
      gap="4px"
      {...rest}
    >
      {primaryDomain || account.name}
      {!!primaryDomain && <Image src={aznsIconSvg} alt="AZERO.ID Logo" width={11} height={11} />}
    </Text>
  )
}

export interface ConnectDashboardProps {
  adminWalletAddresses?: string[]
}

export interface ConnectDashboardProps {}
export const ConnectDashboard: FC<ConnectDashboardProps> = ({ adminWalletAddresses }) => {
  const router = useRouter()
  const { guildId } = router.query
  const {
    activeChain,
    switchActiveChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    setActiveAccount,
  } = useInkathon()
  const { balanceFormatted } = useBalance(activeAccount?.address)
  const [supportedChains] = useState(
    env.supportedChains.map((networkId) => getSubstrateChain(networkId) as SubstrateChain),
  )
  const [allWallets] = useState(allSubstrateWallets)

  const isSSR = useIsSSR()

  // HERE WE'RE UPDATING THE FRONTEND WITH THE LATEST INFO FROM THE BACKEND //

  console.log('admin logs', adminWalletAddresses)

  // DEFAULT VALUES OF THE INPUT FIELDS

  const [initialValues, setInitialValues] = useState({
    message1: '',
    message2: '',
    message3: '',
    roleId: '',
  })

  useEffect(() => {
    const fetchInitialValues = async () => {
      if (guildId) {
        // only run if guildId is defined
        console.log('guildId before fetch:', guildId)
        const response = await fetch(`https://api.op2.app/get-latest-message/${guildId}`)
        const data = await response.json()
        console.log('Received data from server:', data)
        setInitialValues(data)
      }
    }

    fetchInitialValues()
  }, [guildId]) // add guildId to the dependency array

  // WE'RE SHOWING WHAT'S IN THE FORM
  interface FormData {
    message1: string
    message2: string
    message3: string
    roleId: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: initialValues })

  // THIS IS WHERE WE SEND IT TO THE BACKEND

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('https://api.op2.app/update-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message1: data.message1,
          message2: data.message2,
          message3: data.message3,
          roleId: data.roleId,
          guildId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log(responseData)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Connect Button
  if (!activeAccount)
    return (
      <Menu>
        <MenuButton
          as={Button}
          isLoading={isConnecting}
          size="md"
          rightIcon={<FiChevronDown size={22} />}
          py={6}
          fontWeight="bold"
          rounded="2xl"
          colorScheme="blue"
        >
          Connect Wallet
        </MenuButton>

        <MenuList bgColor="blackAlpha.900" borderColor="whiteAlpha.300" rounded="2xl">
          {/* Installed Wallets */}
          {!isSSR &&
            !activeAccount &&
            allWallets.map((w) =>
              isWalletInstalled(w) ? (
                <MenuItem
                  key={w.id}
                  onClick={() => {
                    connect?.(undefined, w)
                  }}
                  tw="bg-transparent hocus:bg-gray-800"
                >
                  {w.name}
                </MenuItem>
              ) : (
                <MenuItem
                  as={Link}
                  href={w.urls.website}
                  key={w.id}
                  tw="bg-transparent opacity-50 hocus:bg-gray-800 hover:(no-underline opacity-70)"
                >
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text>{w.name}</Text>
                      <FiExternalLink size={16} />
                    </HStack>
                    <Text fontSize="xs">Not installed</Text>
                  </VStack>
                </MenuItem>
              ),
            )}
        </MenuList>
      </Menu>
    )

  // Account Menu & Disconnect Button
  if (
    adminWalletAddresses
      ?.map((address) => address.trim().toLowerCase())
      .includes(activeAccount?.address.trim().toLowerCase())
  ) {
    console.log('Active account is admin. Showing admin dashboard content.')
    // Display admin dashboard content
    return (
      <Menu>
        <Box
          w="500px"
          p={4}
          backgroundColor={black}
          color="#F5FEFD"
          boxShadow="0px .5px 1.5px 1px #01EAC7" // white boxShadow
          borderRadius="md"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl color="#F5FEFD" id="message1" isInvalid={!!errors.message1}>
              <Flex justifyContent="space-between" alignItems="center">
                <FormLabel>If the user already has the role:</FormLabel>
                <Tooltip
                  label="The user will be sent a private message in the verification channel if they already have the role to be assigned by the bot."
                  fontSize="md"
                  placement="right"
                  shouldWrapChildren
                >
                  <Icon as={IoIosInformationCircleOutline} w={5} h={5} ml={2} mt={-3} />
                </Tooltip>
              </Flex>
              <Textarea
                {...register('message1')}
                value={initialValues.message1}
                onChange={(e) =>
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    message1: e.target.value,
                  }))
                }
                maxLength={250}
              />
              <FormErrorMessage>{errors.message1 && 'This field is required'}</FormErrorMessage>
            </FormControl>

            <FormControl color="#F5FEFD" id="message2" isInvalid={!!errors.message2} mt={4}>
              <Flex justifyContent="space-between" alignItems="center">
                <FormLabel>Verification success message:</FormLabel>
                <Tooltip
                  label="This is where you put your verification info"
                  fontSize="md"
                  placement="right"
                  shouldWrapChildren
                >
                  <Icon as={IoIosInformationCircleOutline} w={5} h={5} ml={2} mt={-3} />
                </Tooltip>
              </Flex>
              <Textarea
                {...register('message2')}
                value={initialValues.message2}
                onChange={(e) =>
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    message2: e.target.value,
                  }))
                }
                maxLength={250}
              />
              <FormErrorMessage>{errors.message2 && 'This field is required'}</FormErrorMessage>
            </FormControl>

            <FormControl color="#F5FEFD" id="message3" isInvalid={!!errors.message3} mt={4}>
              <Flex justifyContent="space-between" alignItems="center">
                <FormLabel>Verification failure message:</FormLabel>
                <Tooltip
                  label="This is where you put your verification info"
                  fontSize="md"
                  placement="right"
                  shouldWrapChildren
                >
                  <Icon as={IoIosInformationCircleOutline} w={5} h={5} ml={2} mt={-3} />
                </Tooltip>
              </Flex>
              <Textarea
                {...register('message3')}
                value={initialValues.message3}
                onChange={(e) =>
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    message3: e.target.value,
                  }))
                }
                maxLength={250}
              />
              <FormErrorMessage>{errors.message3 && 'This field is required'}</FormErrorMessage>
            </FormControl>

            <FormControl color="#F5FEFD" id="roleId" isInvalid={!!errors.roleId} mt={4}>
              <FormLabel>Role ID:</FormLabel>
              <Tooltip
                label="Choose the role that will be assigned to the users."
                fontSize="md"
                placement="right"
                shouldWrapChildren
              >
                <Icon as={IoIosInformationCircleOutline} w={5} h={5} ml={2} mt={-3} />
              </Tooltip>
              <Input
                {...register('roleId')}
                value={initialValues.roleId}
                onChange={(e) =>
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    roleId: e.target.value,
                  }))
                }
              />
              <FormErrorMessage>{errors.roleId && 'This field is required'}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="blue" mb={2} mt={4} width="100%">
              Submit
            </Button>
          </form>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <HStack>
            {/* Account Balance */}
            {balanceFormatted !== undefined && (
              <Button
                py={6}
                pl={5}
                rounded="2xl"
                fontWeight="bold"
                fontSize="sm"
                fontFamily="mono"
                letterSpacing={-0.25}
                pointerEvents="none"
              >
                {balanceFormatted}
              </Button>
            )}

            {/* Account Name, Address, and AZNS-Domain (if assigned) */}
            <MenuButton
              as={Button}
              rightIcon={<FiChevronDown size={22} />}
              hidden={false}
              py={6}
              pl={5}
              rounded="2xl"
              fontWeight="bold"
            >
              <VStack spacing={0.5}>
                <AccountName account={activeAccount} />
                <Text fontSize="xs" fontWeight="normal" opacity={0.75}>
                  {truncateHash(
                    encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
                    8,
                  )}
                </Text>
              </VStack>
            </MenuButton>
          </HStack>

          <MenuList
            bgColor="blackAlpha.900"
            borderColor="whiteAlpha.300"
            rounded="2xl"
            overflow="auto"
          >
            {/* Supported Chains */}
            {supportedChains.map((chain) => (
              <MenuItem
                key={chain.network}
                isDisabled={chain.network === activeChain?.network}
                onClick={async () => {
                  await switchActiveChain?.(chain)
                  toast.success(`Switched to ${chain.name}`)
                }}
                tw="cursor-default bg-transparent hocus:bg-gray-800"
              >
                <VStack align="start" spacing={0}>
                  <HStack>
                    <Text>{chain.name}</Text>
                    {chain.network === activeChain?.network && <AiOutlineCheckCircle size={16} />}
                  </HStack>
                </VStack>
              </MenuItem>
            ))}

            {/* Available Accounts/Wallets */}
            <MenuDivider />
            {(accounts || []).map((acc) => {
              const encodedAddress = encodeAddress(acc.address, activeChain?.ss58Prefix || 42)
              const truncatedEncodedAddress = truncateHash(encodedAddress, 10)
              return (
                <MenuItem
                  key={encodedAddress}
                  isDisabled={acc.address === activeAccount.address}
                  onClick={() => {
                    setActiveAccount?.(acc)
                  }}
                  tw="cursor-default bg-transparent hocus:bg-gray-800"
                >
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <AccountName account={acc} />
                      {acc.address === activeAccount.address && <AiOutlineCheckCircle size={16} />}
                    </HStack>
                    <Text fontSize="xs">{truncatedEncodedAddress}</Text>
                  </VStack>
                </MenuItem>
              )
            })}

            {/* Disconnect Button */}
            <MenuDivider />
            <MenuItem
              onClick={disconnect}
              icon={<AiOutlineDisconnect size={18} />}
              tw="bg-transparent hocus:bg-gray-800"
            >
              Disconnect
            </MenuItem>
          </MenuList>
        </Box>
      </Menu>
    )
  } else {
    console.log('Active account is not admin. Showing Access Denied message.')
    // Default return statement
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have access to this page.</p>
      </div>
    )
  }
}
