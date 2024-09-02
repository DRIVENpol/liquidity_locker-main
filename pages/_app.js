import Navbar from '../components/Navbar'
import { ChakraProvider, Box } from '@chakra-ui/react'
import NextNProgress from 'nextjs-progressbar';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig} from 'wagmi'
import { 
  // mainnet, 
  // polygon, 
  bsc, 
  bscTestnet, 
  // sepolia 
} from 'wagmi/chains'

import BG from '../assets/bg.png'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  const chains = [ 
    // mainnet, 
    // polygon, 
    bsc, 
    bscTestnet, 
    // sepolia
  ];
  
  const projectId = '80bf1c032a09be33ea76ff96fa785944'
  
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
  })
  
  const ethereumClient = new EthereumClient(wagmiConfig, chains)

  return (
    <>
    <NextNProgress />
    <ChakraProvider>
    <WagmiConfig config={wagmiConfig}>
      <Box bgImage={BG.src} bgSize="cover" bgRepeat="no-repeat" bgPosition="center" minH="100vh">
      <Navbar />
      <Component {...pageProps} />
      </Box>
      <Footer />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} 
          themeVariables={{
            '--w3m-font-family': 'Roboto, sans-serif',
            '--w3m-accent-color': '#333333'
          }}
        />
      </WagmiConfig>
    </ChakraProvider>
    </>
  )
}

export default MyApp
