import { web3 } from '@project-serum/anchor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';
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
      data = await state.connection.program.account.transaction.all();
      console.log(data);
      const myTransactions = data.filter(
        (transaction) =>
          transaction.account.wallet.toString() === state.connection.msig
      );
      console.log(myTransactions);
      return {
        peding: myTransactions.filter(
          (transaction) => transaction.account.didExecute === false
        ),
        completed: myTransactions.filter(
          (transaction) => transaction.account.didExecute === true
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
          owner: state.connection.provider.publicKey,
        },
        signers: [],
      });
    } catch (err) {
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
          owner: state.connection.provider.publicKey,
        },
        signers: [],
      });
    } catch (err) {
      console.log(err);
    }
  }
);

interface IexecuteTransaction {
  transactionPublicKey: PublicKey;
  type: 'transfer' | 'set_owners' | 'set_threshold';
}
export const executeTransaction = createAsyncThunk(
  'payload/executeTransaction',
  async (args: IexecuteTransaction, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
      [new PublicKey(state.connection.msig).toBuffer()],
      state.connection.program.programId
    );
    switch (args.type) {
      case 'set_owners': {
        try {
          const tx = await state.connection.program.rpc.executeTransaction({
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
          console.log({ tx: tx });
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case 'set_threshold': {
        try {
          const tx = await state.connection.program.rpc.executeTransaction({
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
          console.log({ tx: tx });
        } catch (err) {
          console.log(err);
        }
        break;
      }
      default:
        return null;
    }
  }
);
