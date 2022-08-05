import { PublicKey, Transaction } from '@solana/web3.js';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '..';
import {
  AppDispatch,
  approveTransaction,
  cancelTransactionApproval,
  deleteTransaction,
  executeTransaction,
  executeTransferTransaction,
  loadWalletData,
  ReduxState,
  RootState,
  transferFunds,
} from '../../redux';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  twStyles?: string;
}

export const Card: React.FC<CardProps> = ({ children, twStyles, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        twStyles ? twStyles : ''
      } w-full flex flex-row p-2 h-14 bg-purple-300 bg-opacity-50 rounded border border-slate-300 justify-between hover:shadow-lg transition-all duration-300 `}
    >
      {children}
    </div>
  );
};

interface TransactionCardProps {
  hash: string;
  completed?: boolean;
  transaction?: any;
  twStyles?: string;
  setModalData: (x: {
    data: PublicKey[];
    value: string;
    open: boolean;
    type: string;
  }) => void;
}
export const TransactionCard: React.FC<TransactionCardProps> = ({
  hash,
  completed,
  transaction,
  twStyles,
  setModalData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, connection } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const { threshold } = wallet;
  const handleCancel = async (e: any) => {
    e.stopPropagation();
    await dispatch(
      cancelTransactionApproval({ transactionPublicKey: transaction.publicKey })
    );
  };

  const handleDelete = async (e: any) => {
    e.stopPropagation();
    await dispatch(
      deleteTransaction({ transactionPublicKey: transaction.publicKey })
    );
  };
  const handleExecute = async (e: any) => {
    e.stopPropagation();
    console.log(transaction.account.txType.toString());
    if (transaction.account.txType.toString() !== '2') {
      await dispatch(
        executeTransaction({
          transactionPublicKey: transaction.publicKey,
        })
      );
    } else {
      await dispatch(
        executeTransferTransaction({
          tx: transaction,
        })
      );
    }
  };
  const handleApprove = async (e: any) => {
    await dispatch(
      approveTransaction({ transactionPublicKey: transaction.publicKey })
    );
  };
  const countSigners = () => {
    let count = 0;
    transaction.account.signers.forEach((signer) => {
      if (signer) {
        count++;
      }
    });
    return count;
  };
  const isSigner = () => {
    const index = wallet.accounts.findIndex(
      (acc) =>
        acc.toString() === connection.provider.wallet.publicKey.toString()
    );
    return transaction.account.signers[index];
  };
  return (
    <Card
      twStyles={twStyles}
      onClick={() => {
        console.log(transaction);
        setModalData({
          open: true,
          data: transaction.account.txData,
          value: transaction.account.txValue.toString(),
          type: transaction.account.txType.toString(),
        });
      }}
    >
      <>
        <span className="font-semibold leading-10">{hash}</span>
        {!completed && (
          <div className="flex flex-row gap-6 items-center min-w-80">
            <div className="flex flex-row">
              <span className="text-white mr-2 font-semibold">
                Required Signers
              </span>
              <div className="f-full bg-slate-100 roudned w-12 text-center text-purple-900 font-bold">
                {countSigners()}/{threshold}
              </div>
            </div>
            {!isSigner() ? (
              <Button primary label="Approve" onClick={handleApprove} />
            ) : (
              <Button label="Cancel" onClick={handleCancel} />
            )}
            {countSigners() >= threshold && (
              <Button primary label="Execute" onClick={handleExecute} />
            )}
            {countSigners() === 0 && (
              <Button label="Delete" onClick={handleDelete} />
            )}
          </div>
        )}
      </>
    </Card>
  );
};
