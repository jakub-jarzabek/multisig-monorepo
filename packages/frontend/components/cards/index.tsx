import { PublicKey, Transaction } from "@solana/web3.js";
import useMediaQuery from "../../hooks/useMediaQuery";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "..";
import {
  AppDispatch,
  approveTransaction,
  cancelTransactionApproval,
  deleteTransaction,
  executeTransaction,
  executeTransferTransaction,
  loadTransactions,
  loadWalletData,
  ReduxState,
  RootState,
} from "../../redux";
import { trimAddress } from "../../utils/trimAddress";

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
        twStyles ? twStyles : ""
      } w-full overflow-scroll md:overflow-hidden flex flex-row p-2 h-14 bg-purple-300 bg-opacity-50 rounded border border-slate-300 justify-between hover:shadow-lg transition-all duration-300 `}
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
    ts: string;
  }) => void;
}
export const TransactionCard: React.FC<TransactionCardProps> = ({
  hash,
  completed,
  transaction,
  twStyles,
  setModalData,
}) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const refreshData = () => {
    dispatch(loadWalletData());
    dispatch(loadTransactions());
  };
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, connection, evm } = useSelector<RootState, ReduxState>(
    (state) => state
  );
  const { threshold } = wallet;
  const handleCancel = async (e: any) => {
    e.stopPropagation();
    if (connection.chain === "sol") {
      await dispatch(
        cancelTransactionApproval({
          transactionPublicKey: transaction.publicKey,
        })
      );
    } else {
      await dispatch(
        cancelTransactionApproval({
          transactionPublicKey: transaction.publicKey,
          index: transaction.account.index,
        })
      );
    }
    refreshData();
  };

  const handleDelete = async (e: any) => {
    e.stopPropagation();
    if (connection.chain === "sol") {
      await dispatch(
        deleteTransaction({ transactionPublicKey: transaction.publicKey })
      );
    } else {
      await dispatch(
        deleteTransaction({
          transactionPublicKey: transaction.publicKey,
          index: transaction.account.index,
        })
      );
    }

    refreshData();
  };
  const handleExecute = async (e: any) => {
    e.stopPropagation();
    if (connection.chain === "eth") {
      await dispatch(
        executeTransaction({
          transactionPublicKey: transaction.publicKey,
          index: transaction.account.index,
        })
      );
      refreshData();
    } else {
      if (transaction.account.txType.toString() !== "2") {
        await dispatch(
          executeTransaction({
            transactionPublicKey: transaction.publicKey,
          })
        );

        refreshData();
      } else {
        await dispatch(
          executeTransferTransaction({
            tx: transaction,
          })
        );
        refreshData();
      }
    }
  };
  const handleApprove = async (e: any) => {
    e.stopPropagation();
    if (connection.chain === "sol") {
      await dispatch(
        approveTransaction({ transactionPublicKey: transaction.publicKey })
      );
    } else {
      await dispatch(
        approveTransaction({
          transactionPublicKey: transaction.publicKey,
          index: transaction.account.index,
        })
      );
    }
    refreshData();
  };
  const countSigners = () => {
    if (connection.chain === "sol") {
      let count = 0;
      transaction.account.signers.forEach((signer) => {
        if (signer) {
          count++;
        }
      });
      return count;
    } else {
      return transaction.account.threshold;
    }
  };
  const isSigner = () => {
    if (connection.chain === "sol") {
      const index = wallet.accounts.findIndex(
        (acc) =>
          acc.toString() === connection.provider.wallet.publicKey.toString()
      );
      return transaction.account.signers[index];
    } else {
      return transaction.account.signers
        .map((sig) => sig.toString().toLowerCase())
        .includes(evm.wallet.toLowerCase());
    }
  };
  return (
    <Card
      twStyles={twStyles}
      onClick={() => {
        setModalData({
          open: true,
          data: transaction.account.txData,
          value: transaction.account.txValue.toString(),
          type: transaction.account.txType.toString(),
          ts: transaction.account.createdAt.toString(),
        });
      }}
    >
      <>
        <span className="font-semibold leading-10">{trimAddress(hash, 3)}</span>
        {!completed && (
          <div className="flex flex-row gap-6 items-center min-w-80">
            <div className="flex flex-row">
              <span className="text-white mr-2 font-semibold">
                {matches ? "Required Signers" : ""}
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
