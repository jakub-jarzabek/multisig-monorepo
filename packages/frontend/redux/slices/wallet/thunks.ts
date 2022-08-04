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
