import { useMemo } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./styles.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader, Burger } from "../components";
import { MoralisProvider } from "react-moralis";

function CustomApp({ Component, pageProps }: AppProps) {
  const solNetwork = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
    ],
    [solNetwork]
  );
  return (
    <>
      <Head>
        <title>Multi Signature Wallet</title>
      </Head>
      <main className="app">
        <ReduxProvider store={store}>
          <MoralisProvider
            serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
            appId={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
          >
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                  <>
                    <Burger />
                    <ToastContainer />
                    <Component {...pageProps} />
                    <Loader />
                  </>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </MoralisProvider>
        </ReduxProvider>
      </main>
    </>
  );
}

export default CustomApp;
