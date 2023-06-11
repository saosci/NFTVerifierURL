import { CenterBody } from '@components/layout/CenterBody'
import { ConnectDashboard } from '@components/web3/ConnectDashboard'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'twin.macro'

const DashboardPage: NextPage = () => {
  const router = useRouter()
  const { guildId } = router.query
  const { activeAccount } = useInkathon()

  const [walletAddresses, setWalletAddresses] = useState<string[]>([])

  useEffect(() => {
    const fetchWalletAddresses = async () => {
      try {
        const response = await fetch(`https://op2.app/wallets/${guildId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWalletAddresses(data.walletAddresses)
      } catch (error) {
        console.error('Error fetching wallet addresses:', error)
      }
    }

    fetchWalletAddresses()
  }, [guildId])

  console.log('admin wallets', walletAddresses)

  return (
    <CenterBody tw="mt-20 mb-10 px-5">
      {/* Connect Wallet Button */}
      <ConnectDashboard adminWalletAddresses={walletAddresses} />
      <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4"></div>
    </CenterBody>
  )
}

export default DashboardPage
