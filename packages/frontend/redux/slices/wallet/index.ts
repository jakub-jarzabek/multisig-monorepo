import { BN } from '@project-serum/anchor';
import { createSlice } from '@reduxjs/toolkit';
import {
  loadWalletData,
  loadTransactions,
  ITransferTx,
  executeTransaction,
  executeTransferTransaction,
} from './thunks';

export interface IWalletSlice {
  accounts: BN[];
  balance: number;
  threshold: number;
  transactions: ITransactions;
  loading: boolean;
}

interface ITransactions {
  peding: ITransferTx[];
  completed: ITransferTx[];
  deleted: ITransferTx[];
}

const initialState: IWalletSlice = {
  loading: false,
  accounts: null,
  balance: null,
  threshold: null,
  transactions: {
    peding: null,
    completed: null,
    deleted: null,
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
      state.loading = false;
    });
    builder.addCase(loadTransactions.fulfilled, (state, action) => {
      state.transactions.completed = action.payload.completed;
      state.transactions.peding = action.payload.peding;
      state.transactions.deleted = action.payload.deleted;
      state.loading = false;
    });
    builder.addCase(executeTransaction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(executeTransaction.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(executeTransferTransaction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(executeTransferTransaction.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loadTransactions.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loadWalletData.pending, (state, action) => {
      state.loading = false;
    });
  },
});

export const Wallet = {};
export default walletSlice.reducer;
export * from './thunks';
