import { BN } from '@project-serum/anchor';
import { createSlice } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';
import { loadWalletData } from './thunks';

export interface IWalletSlice {
  accounts: BN[];
  balance: number;
}

const initialState: IWalletSlice = {
  accounts: null,
  balance: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWalletData.fulfilled, (state, action) => {
      state.accounts = action.payload.accounts;
      state.balance = action.payload.balance;
    });
  },
});

export const Wallet = {};
export default walletSlice.reducer;
export * from './thunks';
