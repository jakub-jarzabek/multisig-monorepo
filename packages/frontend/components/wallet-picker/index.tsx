import { AppDispatch, logInToWallet } from '../../redux';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '../cards';
import Blockies from 'react-blockies';

export const WalletPicker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wallets = ['aaaaaaaaaaaaaaaaaa', 'dddddddddddddddddddd'];
  const handleLogIn = (pk: string) => {
    dispatch(logInToWallet({ pk }));
  };
  return (
    <div className="flex items-center p-8 gap-4 flex-col w-1/2 mx-auto mt-40 rounded-3xl shadow-3xl  bg-gradient-to-r from-purple-100 to-purple-300 bg-opacity bg-opacity-50 border-1 border-slate-200  backdrop-blur-md">
      <h1 className="text-2xl font-semibold text-purple-900">Choose Wallet</h1>
      {wallets.map((wallet, i) => (
        <Card
          key={'wallet-' + i}
          twStyles="hover:magic cursor-pointer"
          onClick={() => handleLogIn(wallet)}
        >
          <span className="leading-10 font-semibold text-slate-700">
            {wallet}
          </span>
          <Blockies size={10} seed={wallet} bgColor="#800080" />
        </Card>
      ))}
    </div>
  );
};
