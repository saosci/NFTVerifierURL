import Link from 'next/link'
import { FC } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import 'twin.macro'

export const HomeTopBar: FC = () => {
  return (
    <>
      <Link
        href="https://discord.com/api/oauth2/authorize?client_id=1097496492048130139&permissions=2952915984&scope=bot"
        tw="absolute top-0 left-0 right-0 z-10 flex items-center justify-center whitespace-pre-wrap bg-gray-900 py-3 px-2 text-center font-semibold text-sm text-white/75 hover:text-white"
      >
        <div tw="mr-2 rounded bg-amber-300 px-1 py-0.5 font-black text-xs text-black">NEW</div>
        <div tw="font-bold">
          <span tw="hidden sm:inline">We released our new </span> Discord NFT verification Bot!
        </div>
        <HiOutlineExternalLink tw="ml-1.5" />
      </Link>
    </>
  )
}
