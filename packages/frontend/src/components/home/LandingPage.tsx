import Link from 'next/link'
import MrMoneybags from 'public/brand/MrMoneybags.png'
import Image from 'next/image'
import { FC } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const LandingPage: FC = () => {
  const title = 'Office Party'
  const desc = 'Office Party Presents'
  const desck = 'Aleph Zero NFT verification bot'
  const discord = 'https://discord.gg/HkvPV3gAcy'

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        <Link
          href={discord}
          target="_blank"
          className="group"
          tw="flex cursor-pointer items-center gap-4 rounded-3xl py-1.5 px-3.5 transition-all hover:bg-gray-900"
        >
          <Image src={MrMoneybags} priority width={60} alt="Mr. Moneybags" />
          <h1 tw="font-black text-[2.5rem]">{title}</h1>
        </Link>
      </div>
    </>
  )
}
