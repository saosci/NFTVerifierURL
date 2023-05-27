import { HomePageTitle } from '@components/home/HomePageTitle'
import { CenterBody } from '@components/layout/CenterBody'
import { BalanceContractInteraction } from '@components/web3/BalanceContractInteraction'
import { ConnectButton } from '@components/web3/ConnectButton'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import 'twin.macro'
import type { NextPage } from 'next'

const VerifyPage: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query

  useEffect(() => {
    // Here you can do something with the userId, like passing it to the BalanceContractInteraction component
    console.log(userId)
  }, [userId])

  return (
    <CenterBody tw="mt-20 mb-10 px-5">
      {/* Title */}
      <HomePageTitle />

      {/* Greeter Read/Write Contract Interactions */}
      <BalanceContractInteraction />

      {/* Connect Wallet Button */}
      <ConnectButton />

      <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4"></div>
    </CenterBody>
  )
}

export default VerifyPage
