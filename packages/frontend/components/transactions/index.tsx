import React from 'react';
import { TransactionCard } from '..';

export const Transactions = () => {
  const transactions = [{hash:'123'}];
  return (
    <div className="flex flex-col items-center gap-10">
      <div className=" w-full flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-blue mb-2 ">Pending</h1>
      
        {transactions.map((tx, i) => (
          <TransactionCard key={'pending' + i} hash={tx.hash} />
        ))}
      </div>
      <div className="flex flex-col items-center w-full ">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-green mb-2 ">Completed</h1>
        {transactions.map((tx, i) => (
          <TransactionCard key={'completed' + i} hash={tx.hash} completed />
        ))}
      </div>
    </div>
  );
};
