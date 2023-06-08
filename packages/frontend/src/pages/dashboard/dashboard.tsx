import { CenterBody } from '@components/layout/CenterBody'
import { ConnectDashboard } from '@components/web3/ConnectDashboard'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'twin.macro'
const adminWalletAddress = process.env.NEXT_PUBLIC_YOUR_WALLET_ADDRESS

const DashboardPage: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const { activeAccount } = useInkathon()

  useEffect(() => {
    // Here you can do something with the userId, like passing it to the BalanceContractInteraction component
    console.log(userId)
  }, [userId])

  return (
    <CenterBody tw="mt-20 mb-10 px-5">
      {/* Connect Wallet Button */}
      <ConnectDashboard adminWalletAddress={adminWalletAddress} />
      <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4"></div>
    </CenterBody>
  )
}

export default DashboardPage
