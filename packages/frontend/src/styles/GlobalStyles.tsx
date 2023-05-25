import { Global } from '@emotion/react'
import 'nprogress/nprogress.css'
import tw, { GlobalStyles as BaseStyles, css } from 'twin.macro'

const customStyles = css`
  html {
    ${tw`scroll-smooth antialiased`}
  }
  body {
    ${tw`bg-black text-white`}
    ${tw`relative h-screen min-h-screen`}
  }

  #__next,
  #__next > div {
    ${tw`relative flex h-full min-h-full flex-col`}
  }

  /* Progress Bar */
  #nprogress {
    .bar {
      ${tw`bg-white`}
    }
    .peg,
    .spinner {
      ${tw`!hidden`}
    }
  }

  /* Blink Animation */
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
