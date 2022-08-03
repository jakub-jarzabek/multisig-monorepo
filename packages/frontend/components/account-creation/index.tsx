import React, { useState } from 'react';
import { Card, Button, Input } from '..';
import { RiDeleteBin5Line } from 'react-icons/ri';

export const AccountCreation = (props: {}) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountInput, setAccountInput] = useState('');
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput]);
    setAccountInput('');
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-row justify-around items-center">
        <Input
          onChange={(e) => setAccountInput(e)}
          value={accountInput}
          placeholder="Account Address"
        />
        <Button onClick={addAccount} primary label="Add" />
      </div>
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
    </div>
  );
};
