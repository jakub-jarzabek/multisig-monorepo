import { AnchorError, BN, web3 } from "@project-serum/anchor";
import { bindActionCreators, createAsyncThunk } from "@reduxjs/toolkit";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { toast } from "react-toastify";
import { ReduxState } from "..";

export const loadWalletData = createAsyncThunk(
  "payload/loadWalletData",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;
    let balance;
    if (state.connection.chain === "sol") {
      try {
        data = await state.connection.program.account.wallet.fetch(
          state.connection.msig
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      try {
        balance = await state.connection.web3.getBalance(
          new PublicKey(state.connection.msig)
        );
      } catch (err) {
        console.log(err);
      }
      return {
        accounts: data.owners,
        ownerSeq: Number(data.ownerSeq.toString()),
        balance,
        threshold: Number(data.threshold.toString()),
      };
    } else {
      try {
        const balance = await state.evm.provider.getBalance(
          state.connection.msig
        );
        const threshold = await state.evm.walletContract.threshold();
        const owners = await state.evm.walletContract.getOwners();
        return {
          accounts: owners.map((owner) => owner.toString()),
          ownerSeq: 0,
          balance: Number(balance.toString()),
          threshold: Number(threshold.toString()),
        };
      } catch (err) {
        console.log(err);
      }
    }
  }
);
export const loadTransactions = createAsyncThunk(
  "payload/loadTransactions",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;
    try {
      if (state.connection.chain === "sol") {
        const normal = await state.connection.program.account.transaction.all();
        const transfer =
          await state.connection.program.account.transferTransaction.all();
        data = [...normal, ...transfer];
        const myTransactions = data.filter(
          (transaction) =>
            transaction.account.wallet.toString() === state.connection.msig
        );
        return {
          peding: myTransactions
            .filter(
              (transaction) =>
                transaction.account.didExecute === false &&
                transaction.account.deleted === false &&
                transaction.account.ownerSeq >= state.wallet.ownerSeq
            )
            .sort((a, b) => {
              return b.account.createdAt - a.account.createdAt;
            }),
          completed: myTransactions
            .filter(
              (transaction) =>
                transaction.account.didExecute === true &&
                transaction.account.deleted === false
            )
            .sort((a, b) => {
              return b.account.createdAt - a.account.createdAt;
            }),
          deleted: myTransactions
            .filter((transaction) => transaction.account.deleted)
            .sort((a, b) => {
              return b.account.createdAt - a.account.createdAt;
            }),
        };
      } else {
        return {
          peding: [],
          completed: [],
          deleted: [],
        };
      }
    } catch (err) {
      console.log(err);
    }

    return null;
  }
);
interface IapproveTransaction {
  transactionPublicKey: PublicKey;
}
export const approveTransaction = createAsyncThunk(
  "payload/approveTransaction",
  async (args: IapproveTransaction, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    try {
      const tx = await state.connection.program.rpc.approve({
        accounts: {
          wallet: new PublicKey(state.connection.msig),
          transaction: args.transactionPublicKey,
          owner: state.connection.provider.wallet.publicKey,
        },
      });
      toast.success("Transaction approved");
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return true;
  }
);
export const cancelTransactionApproval = createAsyncThunk(
  "payload/cancelTransaction",
  async (args: IapproveTransaction, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    try {
      const tx = await state.connection.program.rpc.cancelApproval({
        accounts: {
          wallet: new PublicKey(state.connection.msig),
          transaction: args.transactionPublicKey,
          owner: state.connection.provider.wallet.publicKey,
        },
      });
      toast.success("Approval revoked");
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return true;
  }
);
export const deleteTransaction = createAsyncThunk(
  "payload/deleteTransaction",
  async (args: IapproveTransaction, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    try {
      const tx = await state.connection.program.rpc.deleteTransaction({
        accounts: {
          wallet: new PublicKey(state.connection.msig),
          transaction: args.transactionPublicKey,
          owner: state.connection.provider.wallet.publicKey,
        },
      });
      toast.success("Transaction deleted");
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return true;
  }
);

interface IexecuteTransaction {
  transactionPublicKey: PublicKey;
}
export const executeTransaction = createAsyncThunk(
  "payload/executeTransaction",
  async (args: IexecuteTransaction, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
      [new PublicKey(state.connection.msig).toBuffer()],
      state.connection.program.programId
    );

    try {
      await state.connection.program.rpc.executeTransaction({
        accounts: {
          wallet: new PublicKey(state.connection.msig),
          walletSigner,
          transaction: args.transactionPublicKey,
        },
        remainingAccounts: state.connection.program.instruction.setOwners
          .accounts({
            wallet: new PublicKey(state.connection.msig),
            walletSigner,
          })

          //eslint-disable-next-line
          // @ts-ignore
          .map((meta) =>
            meta.pubkey.equals(walletSigner)
              ? { ...meta, isSigner: false }
              : meta
          )
          .concat({
            pubkey: state.connection.program.programId,
            isWritable: false,
            isSigner: false,
          }),
      });

      toast.success("Transaction executed");
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return true;
  }
);

export interface ITransferTx {
  publicKey: PublicKey;
  account: {
    wallet: PublicKey;
    programId: PublicKey;
    didExecute: boolean;
    ownerSeq: BN;
    txType: BN;
    txValue: BN;
    deleted: boolean;
    from: PublicKey;
    to: PublicKey;
    value: BN;
    createdAt: BN;
  };
}
interface IexecuteTransferTransaction {
  tx: ITransferTx;
}
export const executeTransferTransaction = createAsyncThunk(
  "payload/executeTransferTransaction",
  async (args: IexecuteTransferTransaction, thunkAPI) => {
    const { tx } = args;
    const state = thunkAPI.getState() as ReduxState;

    try {
      await state.connection.program.rpc.executeTransferTransaction({
        accounts: {
          wallet: new PublicKey(state.connection.msig),
          transaction: tx.publicKey,
          from: new PublicKey(state.connection.msig),
          to: tx.account.to,
          systemProgram: SystemProgram.programId,
          user: state.connection.provider.publicKey,
        },
      });

      toast.success("Transaction executed");
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }
    return true;
  }
);
