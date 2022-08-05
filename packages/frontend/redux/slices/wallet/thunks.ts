import { web3 } from '@project-serum/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { ReduxState } from '..';

export const loadWalletData = createAsyncThunk(
  'payload/loadWalletData',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;
    let balance;
    try {
      data = await state.connection.program.account.wallet.fetch(
        state.connection.msig
      );
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
      balance,
      threshold: Number(data.threshold.toString()),
    };
  }
);
export const loadTransactions = createAsyncThunk(
  'payload/loadTransactions',
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;
    try {
      const normal = await state.connection.program.account.transaction.all();
      const transfer =
        await state.connection.program.account.transferTransaction.all();
      data = [...normal, ...transfer];
      console.log(data);
      const myTransactions = data.filter(
        (transaction) =>
          transaction.account.wallet.toString() === state.connection.msig
      );
      console.log(myTransactions);
      return {
        peding: myTransactions.filter(
          (transaction) =>
            transaction.account.didExecute === false &&
            transaction.account.deleted === false
        ),
        completed: myTransactions.filter(
          (transaction) =>
            transaction.account.didExecute === true &&
            transaction.account.deleted === false
        ),
        deleted: myTransactions.filter(
          (transaction) => transaction.account.deleted
        ),
      };
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
  'payload/approveTransaction',
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
      toast.success('Transaction approved');
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }
);
export const cancelTransactionApproval = createAsyncThunk(
  'payload/cancelTransaction',
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
      toast.success('Approval revoked');
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }
);
export const deleteTransaction = createAsyncThunk(
  'payload/deleteTransaction',
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
      toast.success('Transaction deleted');
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }
);

interface IexecuteTransaction {
  transactionPublicKey: PublicKey;
}
export const executeTransaction = createAsyncThunk(
  'payload/executeTransaction',
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

      toast.success('Transaction executed');
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }
);

export const executeTransferTransaction = createAsyncThunk(
  'payload/executeTransaction',
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

      toast.success('Transaction executed');
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }
);
