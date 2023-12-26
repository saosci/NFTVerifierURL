import { FC } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import 'twin.macro'
import discordlogo from 'public/icons/discordlogo.svg'
import Image from 'next/image'
import tw, { styled } from 'twin.macro'
import Link from 'next/link'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const LandingPage: FC = () => {
  const title = 'Office Party'
  const discord = 'https://discord.gg/HkvPV3gAcy'
  const memoire = 'Ever since Mr. MoneyBags disappeared'
  const money = 'the party has not stopped'

  const handleMouseEnter = () => {
    // Your logic for drawing on the canvas or other interactions
  }

  const styles = {
    border: '0rem solid #9c9c9c',
    borderRadius: '0rem',
  }

  const Canvas = () => {
    return (
      <ReactSketchCanvas
        style={styles}
        width="512px"
        height="512px"
        backgroundImage="none"
        svgStyle={{
          backgroundImage: "url('https://i.imgur.com/iOKqtrq.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        strokeWidth={4}
        strokeColor="red"
      />
    )
  }

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        <h1 tw="font-black text-[2.5rem]">{title}</h1>
      </div>
      <div tw="flex flex-col items-center text-center font-mono" onMouseEnter={handleMouseEnter}>
        <Canvas />
        <p tw="mt-4 mb-6 text-gray-400">
          {memoire}
          <br></br>
          {money}
          <br></br>
        </p>
        <StyledIconLink href={discord} target="_blank">
          <Image src={discordlogo} priority height={32} alt="Telegram Group" />
        </StyledIconLink>
        Join the party
      </div>
    </>
  )
}
