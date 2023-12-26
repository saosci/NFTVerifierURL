import { ChakraProvider, DarkMode } from '@chakra-ui/react'
import { BaseLayout } from '@components/layout/BaseLayout'
import { HotToastConfig } from '@components/layout/HotToastConfig'
import { env } from '@config/environment'
import { getDeployments } from '@deployments/deployments'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { SubstrateDeployment, UseInkathonProvider } from '@scio-labs/use-inkathon'
import GlobalStyles from '@styles/GlobalStyles'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { Inconsolata } from 'next/font/google'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// Google Fonts via next/font
const inconsolata = Inconsolata({
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const guildId = router.query.guildId
  const [contractAddress, setContractAddress] = useState(null)
  const [deployments, setDeployments] = useState<SubstrateDeployment[]>([])
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  useEffect(() => {
    if (guildId) {
      setIsLoading(true)
      const fetchContractAddress = async () => {
        try {
          const response = await fetch(`https://api.op2.app/get-latest-message/${guildId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setContractAddress(data.ContractIds)
        } catch (error) {
          console.error('Failed to fetch contract address:', error)
        }
      }

      fetchContractAddress()
    }
  }, [guildId])
  console.log('fetched contract:', contractAddress)

  useEffect(() => {
    console.log('useEffect triggered with contractAddress:', contractAddress);
  
    if (contractAddress) {
      console.log('Contract address is available, loading deployments...');
  
      const loadDeployments = async () => {
        try {
          console.log('Calling getDeployments with contractAddress:', contractAddress);
          const deployments = await getDeployments(contractAddress);
          console.log('Deployments fetched:', deployments);
  
          setDeployments(deployments);
          setIsLoading(false);
          console.log('Deployments set and isLoading set to false');
        } catch (error) {
          console.error('Error fetching deployments:', error);
          setIsLoading(false); // Consider setting loading to false even in case of error
        }
      };
  
      loadDeployments();
    } else {
      console.log('Contract address is not available, setting isLoading to false after 1 second');
      // If the contract address is null, wait for 1 second before setting isLoading to false
      setTimeout(() => {
        setIsLoading(false);
        console.log('isLoading set to false after timeout');
      }, 1000);
    }
  }, [contractAddress]);
  

  if (isLoading) {
    return <div>Loading...</div> // Render loading state
  }

  return (
    <>
      {/* TODO SEO */}
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Dappy" // TODO
        titleTemplate="%s | Dappy" // TODO
        description="NFT Verification" // TODO
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'Dappy', // TODO
          images: [
            {
              url: `${env.url}/images/cover.jpg`, // TODO
              width: 1200,
              height: 675,
            },
          ],
        }}
        twitter={{
          handle: '@OfficePartyNFT', // TODO
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Set Font Variables */}
        <style>{`
          :root {
            --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
          }
        `}</style>
      </Head>

      <UseInkathonProvider
        appName="Dappy" // TODO
        connectOnInit={false}
        defaultChain={env.defaultChain}
        deployments={Promise.resolve(deployments)}
      >
        <CacheProvider value={cache}>
          <ChakraProvider>
            <DarkMode>
              <GlobalStyles />

              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>

              <HotToastConfig />
            </DarkMode>
          </ChakraProvider>
        </CacheProvider>
      </UseInkathonProvider>
    </>
  )
}

export default MyApp
