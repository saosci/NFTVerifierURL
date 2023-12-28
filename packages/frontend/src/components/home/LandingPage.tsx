import { FC, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import 'twin.macro'
import discordlogo from 'public/icons/discordlogo.svg'
import telegrambutton from 'public/icons/telegrambutton.svg'
import twitterbutton from 'public/icons/twitterbutton.svg'
import Image from 'next/image'
import tw, { styled } from 'twin.macro'
import Link from 'next/link'

const StyledIconLink = styled(Link)(() => [
  tw`opacity-90 transition-all hover:(-translate-y-0.5 opacity-100)`,
])

export const LandingPage: FC = () => {
  const title = 'Office Party'
  const discord = 'https://discord.gg/HkvPV3gAcy'
  const telegram = 'https://t.me/OfficeParty'
  const twitter = 'https://twitter.com/OfficePartyNFT'
  const memoire = 'Ever since Mr. MoneyBags disappeared'
  const money = 'the party has not stopped'
  const canvasRef = useRef(null);
  const [isRewardEligible, setIsRewardEligible] = useState(false);

  const handleMouseEnter = () => {
    // Your logic for drawing on the canvas or other interactions
  }

  const targetArea = {
    x: 600, // Adjust these values based on the canvas size
    y: 775,
    width: 20,
    height: 20
  };

  const checkEncirclement = (paths: any[], targetArea: { x: number; y: number; width: number; height: number }) => {
    let crossesLeft = false;
    let crossesRight = false;
    let crossesTop = false;
    let crossesBottom = false;
  
    paths.forEach(path => {
      path.forEach(point => {
        if (point.x < targetArea.x) crossesLeft = true;
        if (point.x > targetArea.x + targetArea.width) crossesRight = true;
        if (point.y < targetArea.y) crossesTop = true;
        if (point.y > targetArea.y + targetArea.height) crossesBottom = true;
      });
    });
  
    return crossesLeft && crossesRight && crossesTop && crossesBottom;
  };

  const handleStrokeEnd = async () => {
    if (canvasRef.current) {
      const paths = await canvasRef.current.getPaths();
      const userCircledTargetArea = checkEncirclement(paths, targetArea);
      
      if (userCircledTargetArea) {
        setIsRewardEligible(true);
      }
    }
  };

  const styles = {
    border: '0rem solid #9c9c9c',
    borderRadius: '0rem',
  };

  const Canvas = () => {
    const responsiveStyles = {
      ...styles,
      width: '80vw',
      height: '80vw',
      maxWidth: '512px',
      maxHeight: '512px',
    };

    return (
      <ReactSketchCanvas
        ref={canvasRef}
        style={responsiveStyles}
        backgroundImage="none"
        svgStyle={{
          backgroundImage: "url('https://i.imgur.com/iOKqtrq.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        strokeWidth={4}
        strokeColor="red"
        onStrokeEnd={handleStrokeEnd}
      />
    );
  };

  return (
    <>
      <div tw="flex flex-col items-center text-center font-mono">
        <h1 tw="font-black text-[2.5rem]">Office Party</h1>
      </div>
      <div tw="flex flex-col items-center text-center font-mono">
        <Canvas />
        <p tw="mt-4 mb-6 text-gray-400">
          Ever since Mr. MoneyBags disappeared
          <br />
          the party has not stopped
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
      {isRewardEligible && <div>Congratulations! You&apos;ve earned a reward!</div>}
    </>
  );
};

export default LandingPage;
