import { BN } from '@project-serum/anchor';
import { createSlice } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';
import { loadWalletData, loadTransactions } from './thunks';
import { MultiSigWallet } from '../../../tempTypes/multi_sig_wallet';

export interface IWalletSlice {
  accounts: BN[];
  balance: number;
  threshold: number;
  transactions: ITransactions;
}
interface ITransactions {
  peding: any[];
  completed: any[];
}

const initialState: IWalletSlice = {
  accounts: null,
  balance: null,
  threshold: null,
  transactions: {
    peding: null,
    completed: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadWalletData.fulfilled, (state, action) => {
      state.accounts = action.payload.accounts;
      state.balance = action.payload.balance;
      state.threshold = action.payload.threshold;
    });
    builder.addCase(loadTransactions.fulfilled, (state, action) => {
      state.transactions.completed = action.payload.completed;
      state.transactions.peding = action.payload.peding;
    });
  },
});

export const Wallet = {};
export default walletSlice.reducer;
export * from './thunks';
