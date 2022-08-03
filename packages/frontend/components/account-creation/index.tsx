import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '..';
import autoAnimate from '@formkit/auto-animate'

export const AccountCreation = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountInput, setAccountInput] = useState('');
  const removeAccount = (acc: string) => {
    setAccounts(accounts.filter((_) => _ !== acc));
  };
  const addAccount = () => {
    setAccounts([...accounts, accountInput]);
    setAccountInput('');
  };

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-row gap-10 justify-around items-center" >
        <Input
          onChange={(e) => setAccountInput(e)}
          value={accountInput}
          placeholder="Account Address"
        />
        <Button onClick={addAccount} primary label="Add" />
      </div>
      <div className='flex flex-col gap-2 w-full' ref={parent}>
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
