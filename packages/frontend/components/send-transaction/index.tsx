import React, { useState } from 'react';
import { Card, Button, Input } from '..';
import { RiDeleteBin5Line } from 'react-icons/ri';

export const SendTransaction = () => {
  const [confirmations, setConfirmations] = useState<number>();
  const [accounts, setAccounts] = useState<string[]>();
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
  const handleChangeAccounts = () => null;
  const handleSendTokens = () => null;
  return (
    <div className="flex flex-col justify-center gap-10">

      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-2xl">
        <h1 className="text-2xl font-semibold text-purple-600">
          Change Required Confirmations
        </h1>
        <Input
          onChange={(e) => setConfirmations(Number(e))}
          value={String(confirmations)}
          placeholder="Set Confirmations..."
        />
        <Button label="Confirm" onClick={handleChangeConfirmations} />
      </div>

      <div className="p-2 rounded bg-purple-300 border border-slate-300 shadow-2xl">
        <h1 className="text-2xl font-semibold text-purple-600">Send Tokens</h1>
        <Input
          onChange={(e) => setAmount(Number(e))}
          value={String(amount)}
          placeholder="Amount"
        />
        <Input
          onChange={(e) => setReceiver(e)}
          value={receiver}
          placeholder="Receiver Address"
        />
        <Button label="Confirm" onClick={handleSendTokens} />
      </div>

      <div className="rounded bg-purple-300 border border-slate-300 shadow-2xl">
        <h1 className="text-2xl font-semibold text-purple-600">
          Manage Accounts
        </h1>
        <Input
          onChange={(e) => setAccountInput(e)}
          value={accountInput}
          placeholder="Add account..."
        />
        <Button onClick={addAccount} label="Add" />
        {accounts &&
          accounts.map((acc, i) => (
            <Card key={i}>
              <>
                <span>{acc}</span>
                <Button
                  onClick={() => removeAccount(acc)}
                  label={RiDeleteBin5Line}
                />
              </>
            </Card>
          ))}
        <Button label="Confirm Changes" onClick={handleChangeAccounts} />
      </div>
    </div>
  );
};
