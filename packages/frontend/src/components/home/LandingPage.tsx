import { FC } from 'react'
import 'twin.macro'
import discordlogo from 'public/icons/discordlogo.svg'
import telegrambutton from 'public/icons/telegrambutton.svg'
import twitterbutton from 'public/icons/twitterbutton.svg'
import IOU from 'public/images/IOU.png'
import Image from 'next/image'
import tw, { styled } from 'twin.macro'
import Link from 'next/link'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const LandingPage: FC = () => {
  const title = 'Office Party'
  const discord = 'https://discord.gg/HkvPV3gAcy'
  const telegram = 'https://t.me/IOUmeme'
  const twitter = 'https://twitter.com/IOUmeme'
  const memoire = 'Mr. MoneyBags is finally back,'
  const money = 'the party has just started'

  const handleMouseEnter = () => {
    // Your logic for drawing on the canvas or other interactions
  }

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        <h1 tw="font-black text-[2.5rem]">{title}</h1>
        <Image
          src={IOU}
          alt="IOU Image"
          width={512}
          height={512}
          style={{ maxWidth: '80vw', maxHeight: '80vw' }}
        />
      </div>
      <div tw="flex flex-col items-center text-center font-mono" onMouseEnter={handleMouseEnter}>
        <p tw="mt-4 mb-6 text-gray-400">
          {memoire}
          <br></br>
          {money}
          <br></br>
        </p>

        <div tw="flex justify-center space-x-4">
          <StyledIconLink href={discord} target="_blank">
            <Image src={discordlogo} priority height={32} alt="Discord" />
          </StyledIconLink>
          <StyledIconLink href={telegram} target="_blank">
            <Image src={telegrambutton} priority height={32} alt="Telegram" />
          </StyledIconLink>
          <StyledIconLink href={twitter} target="_blank">
            <Image src={twitterbutton} priority height={32} alt="Twitter" />
          </StyledIconLink>
        </div>
        <div>Join the party</div>
      </div>
    </>
  )
}
