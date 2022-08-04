import { ReduxState, RootState } from '../../redux';
import React from 'react';
import { useSelector } from 'react-redux';
import { TransactionCard } from '..';

export const Transactions = () => {
  const { wallet } = useSelector<RootState, ReduxState>((state) => state);
  const { transactions } = wallet;
  return (
    <div className="flex flex-col items-center gap-10">
      <div className=" w-full flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-blue mb-2 ">
          Pending
        </h1>

        {transactions.peding.map((tx, i) => (
          <TransactionCard
            key={'pending' + i}
            hash={tx.publicKey.toString()}
            transaction={tx}
          />
        ))}
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        <h1 className="text-2xl font-semibold text-white  tracking-widest glow-green mb-2">
          Completed
        </h1>
        {transactions.completed.map((tx, i) => (
          <TransactionCard
            key={'completed' + i}
            hash={tx.publicKey.toString()}
            completed
            transaction={tx}
          />
        ))}
      </div>
    </div>
  );
};
