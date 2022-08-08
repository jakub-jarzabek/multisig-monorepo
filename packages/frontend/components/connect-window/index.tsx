import { useState, useRef, useEffect } from 'react';
import autoAnimate from '@formkit/auto-animate';
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
import { WalletPicker, AccountCreation, Modal } from '..';

export const ConnectWindow = () => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const { connection } = useSelector<RootState, ReduxState>((state) => state);
  const { msig, myWallets } = connection;
  const router = useRouter();
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    (async function () {
      if (publicKey) {
        dispatch(Connection.setProviderAndProgram({ wallet }));
        await dispatch(fetchWallet());
        if (msig) {
          router.push('dashboard');
        }
      }
    })();
  }, [publicKey, msig]);

  return (
    <div ref={parent} className="w-screen h-screen">
      {!publicKey ? (
        <div className="w-5/6 md:1/4 h-1/4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl bg-purple-300 r  flex flex-col justify-center items-center">
          <WalletMultiButton />
        </div>
      ) : myWallets?.length === 0 || createMode ? (
        <AccountCreation goBack={() => setCreateMode(false)} />
      ) : (
        <WalletPicker onCreateNew={() => setCreateMode(true)} />
      )}
    </div>
  );
};
