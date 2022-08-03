import { useMemo } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

function CustomApp({ Component, pageProps }: AppProps) {
  const solNetwork = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [solNetwork]);
  return (
    <>
      <Head>
        <title>Multi Signature Wallet</title>
      </Head>
      <main className="app">
        <ReduxProvider store={store}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
              <WalletModalProvider>
                <Component {...pageProps} />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ReduxProvider>
      </main>
    </>
  );
}

export default CustomApp;
