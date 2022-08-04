import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { AppDispatch, Connection, fetchWallet } from '../../redux';
import { Storage } from '../../utils';

export const ConnectWindow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      dispatch(Connection.setProviderAndProgram({ wallet }));
      if (Storage.getItem('wallet')) {
        dispatch(Connection.setWallet(Storage.getItem('wallet')));
      }
      dispatch(fetchWallet());
      router.push('dashboard');
    }
  }, [publicKey]);

  return (
    <div className="w-1/4 h-1/4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl bg-purple-300 border-2 border-slate-300 flex flex-col justify-center items-center">
      <WalletMultiButton />
    </div>
  );
};
