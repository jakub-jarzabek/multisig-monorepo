import React from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export const ConnectWindow = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  return (
    <div className="w-1/4 h-1/4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl bg-purple-300 border-2 border-slate-300 flex flex-col justify-center items-center">
      <WalletMultiButton />
    </div>
  );
};
