import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from '..';
import { toast } from 'react-toastify';
import autoAnimate from '@formkit/auto-animate';
import { cloneDeep } from 'lodash';
import {
  AppDispatch,
  IConnectionSlice,
  RootState,
  setOwners,
} from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { PublicKey } from '@solana/web3.js';

export const SendTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connection, wallet } = useSelector<RootState, IConnectionSlice>(
    (state) => state
  );
  const { msig, provider, program } = connection;
  const { accounts: accs } = wallet;
  const [confirmations, setConfirmations] = useState<number>(0);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [receiver, setReceiver] = useState<string>('');
  const [accountInput, setAccountInput] = useState('');
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput]);
    setAccountInput('');
  };
  const handleChangeConfirmations = () => null;
  const handleChangeAccounts = () => {
    dispatch(
      setOwners({
        additionalAccounts: accounts.map((_) => new PublicKey(_)),
        walletPublicKey: new PublicKey(msig),
        signer: provider.wallet.publicKey,
      })
    );
  };
  const handleSendTokens = () => null;
  const parent = useRef(null);
  // effects

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (accs) {
      console.log(accs);
      setAccounts(cloneDeep(accs.map((_) => _.toString())));
    }
  }, [accs]);
  return (
    <div className="flex flex-col justify-center gap-10">
      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300 ">
        <h1 className="text-2xl font-semibold text-white  mb-4">
          Change Required Confirmations
        </h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Number of required confirmations
          </span>
          <Input
            onChange={(e) => setConfirmations(Number(e))}
            value={String(confirmations)}
            placeholder="Set Confirmations..."
          />
        </div>
        <Button label="Confirm" onClick={handleChangeConfirmations} />
      </div>

      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300">
        <h1 className="text-2xl mb-4 font-semibold text-white ">Send Tokens</h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Amount to transfer
          </span>
          <Input
            onChange={(e) => setAmount(Number(e))}
            value={String(amount)}
            placeholder="Amount"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Receiver Address
          </span>
          <Input
            onChange={(e) => setReceiver(e)}
            value={receiver}
            placeholder="Receiver Address"
          />
        </div>
        <Button label="Confirm" onClick={handleSendTokens} />
      </div>

      <div className="rounded p-2 bg-purple-300 border border-slate-300 shadow-xl bg-opacity-60 hover:shadow-2xl duration-300">
        <h1 className="text-2xl mb-4 font-semibold text-white ">
          Manage Accounts
        </h1>
        <div className="flex flex-col mb-2">
          <span className="text-sm text-purple-900 font-semibold">
            Account Address
          </span>
          <div className="flex flex-row  items-center gap-10">
            <Input
              onChange={(e) => setAccountInput(e)}
              value={accountInput}
              placeholder="Add account..."
            />

            <Button onClick={addAccount} label="Add" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full mb-2" ref={parent}>
          <span className="text-sm text-purple-900 font-semibold">
            Account List:
          </span>
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
        <Button label="Confirm Changes" onClick={handleChangeAccounts} />
      </div>
    </div>
  );
};
