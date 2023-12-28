import { LandingPage } from '@components/home/LandingPage'
import { CenterBody } from '@components/layout/CenterBody'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import 'twin.macro'
import { BalanceContractInteraction } from '@components/web3/BalanceContractInteraction'
import { ConnectButton } from '@components/web3/ConnectButton'
import { images } from 'next.config'
import { HomeTopBar } from '@components/home/HomeTopBar'

const HomePage: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
    <HomeTopBar/>
    <CenterBody tw="sm:mt-5 md:mt-10 lg:mt-20 mb-10 px-5">
        {/* Title */}
        <LandingPage />

        <div tw="mt-10 flex w-full flex-wrap items-start justify-center gap-4"></div>
      </CenterBody>
    </>
  )
}

export default HomePage
