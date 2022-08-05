import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@solana/wallet-adapter-react-ui/styles.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppDispatch,
  Connection,
  fetchWallet,
  ReduxState,
  RootState,
} from '../../redux';
import { WalletPicker } from '../wallet-picker';

export const ConnectWindow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const { msig } = connection;
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      dispatch(Connection.setProviderAndProgram({ wallet }));
      dispatch(fetchWallet());
      if (msig) {
        router.push('dashboard');
      }
    }
  }, [publicKey, msig]);

  return (
    <>
      {!publicKey ? (
        <div className="w-1/4 h-1/4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl bg-purple-300 border-2 border-slate-300 flex flex-col justify-center items-center">
          <WalletMultiButton />
        </div>
      ) : (
        <WalletPicker />
      )}
    </>
  );
};
