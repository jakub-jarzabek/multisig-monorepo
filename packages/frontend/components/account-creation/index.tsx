import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '..';
import autoAnimate from '@formkit/auto-animate';
import { AppDispatch, createWallet, logInToWallet } from '../../redux';
import { useDispatch } from 'react-redux';
import { PublicKey } from '@solana/web3.js';

export const AccountCreation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountInput, setAccountInput] = useState('');
  const [logInInput, setLogInInput] = useState('');
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput]);
    setAccountInput('');
  };
  const logIn = () => {
    dispatch(logInToWallet({ pk: logInInput }));
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
    <>
      <div className="flex flex-col gap-4 items-center border border-slate-300 shadow-sm bg-slate-500 bg-opacity-30 rounded p-4">
        <h1 className="text-2xl text-white font-semibold">Create New Wallet</h1>
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
            <div className="flex flex-row gap-2">
              <Button onClick={addAccount} label="Add" />
              <Button onClick={handleCreateWallet} primary label="Create" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full" ref={parent}>
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
      <div className="flex flex-col gap-4 mt-16 items-center border border-slate-300 shadow-sm bg-slate-500 bg-opacity-30 rounded p-4">
        <h1 className="text-2xl text-white font-semibold">
          Log In to Existing Wallet
        </h1>
        <div>
          <h2 className="text-white text-md font-semibold">
            Multisig Public Key
          </h2>
          <div className="flex flex-row gap-10 justify-around items-center">
            <Input
              onChange={(e) => setLogInInput(e)}
              value={logInInput}
              placeholder="Public Key"
            />
            <Button onClick={logIn} primary label="Log In" />
          </div>
        </div>
      </div>
    </>
  );
};
