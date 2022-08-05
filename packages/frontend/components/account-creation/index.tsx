import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '..';
import autoAnimate from '@formkit/auto-animate';
import { AppDispatch, createWallet } from '../../redux';
import { useDispatch } from 'react-redux';
import { PublicKey } from '@solana/web3.js';

interface IAccountCreationProps {
  goBack: () => void;
}
export const AccountCreation: React.FC<IAccountCreationProps> = ({
  goBack,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountInput, setAccountInput] = useState('');
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput]);
    setAccountInput('');
  };

  const handleCreateWallet = () => {
    dispatch(
      createWallet({
        additionalAccounts: accounts.map((_) => new PublicKey(_)),
      })
    );
  };

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  return (
    <div className="w-1/2 min-h-1/4 relative mx-auto mt-60 rounded-xl shadow-xl bg-purple-300 border-1 border-slate-300 flex flex-col pt-10 items-center transition-opacity">
      <span
        onClick={goBack}
        className="text-purple-900 font-bold tracking-widest absolute p-6 left-0 top-0 text-xl cursor-pointer hover:text-purple-500 transition-color duration-300"
      >
        {'<'} Back
      </span>
      <h1 className="text-2xl text-white font-semibold mb-6">
        Create New Wallet
      </h1>
      <div>
        <h2 className="text-white text-md font-semibold">
          Add additional account
        </h2>
        <div className="flex flex-row gap-10 justify-around items-center">
          <Input
            onChange={(e) => setAccountInput(e)}
            value={accountInput}
            placeholder="Account Address"
          />
          <div className="flex flex-row gap-4">
            <Button onClick={addAccount} label="Add" />
            <Button onClick={handleCreateWallet} primary label="Create" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full mt-6" ref={parent}>
        {accounts &&
          accounts.map((acc, i) => (
            <Card key={i}>
              <>
                <span className="leading-10 mr-4">{acc}</span>
                <Button onClick={() => removeAccount(acc)} label="Remove" />
              </>
            </Card>
          ))}
      </div>
    </div>
  );
};
