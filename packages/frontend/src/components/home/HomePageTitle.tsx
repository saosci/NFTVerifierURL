import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const HomePageTitle: FC = () => {
  const title = 'Office Party'
  const desc = 'Office Party Presents'
  const desck = 'Aleph Zero NFT verification bot'
  const discord = 'https://discord.gg/HkvPV3gAcy'

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        {/* Logo & Title */}
        <Link
          href={discord}
          target="_blank"
          className="group"
          tw="flex cursor-pointer items-center gap-4 rounded-3xl py-1.5 px-3.5 transition-all hover:bg-gray-900"
        >
          <h1 tw="font-black text-[2.5rem]">OP²</h1>
        </Link>

        {/* Tagline & Links */}
        <p tw="mt-2 text-gray-600 text-sm">
          Special thanks to{' '}
          <a
            href="https://scio.xyz"
            target="_blank"
            tw="font-semibold text-gray-500 hover:text-gray-100"
          >
            Scio Labs
          </a>
        </p>
        <p tw="mt-4 mb-6 text-gray-400">
          {desc}
          <br></br>
          {desck}
          <br></br>
          Connect your wallet and verify your NFT
        </p>

        <div tw="my-14 w-14 bg-gray-800 h-[2px]" />
      </div>
    </>
  )
}
