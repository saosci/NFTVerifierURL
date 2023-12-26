import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import { BaseLayout } from '@components/layout/BaseLayout';
import { HotToastConfig } from '@components/layout/HotToastConfig';
import { env } from '@config/environment';
import { getDeployments } from '@deployments/deployments';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { SubstrateDeployment, UseInkathonProvider } from '@scio-labs/use-inkathon';
import GlobalStyles from '@styles/GlobalStyles';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { Inconsolata } from 'next/font/google';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Google Fonts via next/font
const inconsolata = Inconsolata({
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const guildId = router.query.guildId;
  const [contractAddress, setContractAddress] = useState(null);
  const [deployments, setDeployments] = useState<SubstrateDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true to show loading initially

  useEffect(() => {
    if (guildId) {
      const fetchContractAddress = async () => {
        try {
          const response = await fetch(`https://api.op2.app/get-latest-message/${guildId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setContractAddress(data.ContractIds);
        } catch (error) {
          console.error('Failed to fetch contract address:', error);
          setIsLoading(false); // Set loading to false in case of error
        }
      };

      fetchContractAddress();
    } else {
      setIsLoading(false); // Set loading to false if guildId is not present
    }
  }, [guildId]);

  useEffect(() => {
    if (contractAddress) {
      const loadDeployments = async () => {
        const fetchedDeployments = await getDeployments(contractAddress);
        setDeployments(fetchedDeployments);
        setIsLoading(false);
      };
      loadDeployments();
    }
  }, [contractAddress]);

  return (
    <>
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Dappy"
        titleTemplate="%s | Dappy"
        description="NFT Verification"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'Dappy',
          images: [
            {
              url: `${env.url}/images/cover.jpg`,
              width: 1200,
              height: 675,
            },
          ],
        }}
        twitter={{
          handle: '@OfficePartyNFT',
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <style>{`:root { --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata'; }`}</style>
      </Head>

      {isLoading ? (
        <div>Loading...</div> // Loading indicator
      ) : (
        <UseInkathonProvider
          appName="Dappy"
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
      )}
    </>
  );
}

export default MyApp;
