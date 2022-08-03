import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReduxState } from '..';
import { PublicKey } from '@solana/web3.js';

interface IcreateWallet {
  additionalAccounts?: PublicKey[];
}
export const loadWalletData = createAsyncThunk(
  'payload/loadWalletData',
  async (args: IcreateWallet, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    try {
      const data = await state.connection.program.account.wallet.fetch(
        state.connection.msig
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    return {};
  }
);
