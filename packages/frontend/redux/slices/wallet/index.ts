import { createSlice } from '@reduxjs/toolkit';
import { PublicKey } from '@solana/web3.js';

export interface IWalletSlice {
  accounts: PublicKey[];
}

const initialState: IWalletSlice = {
  accounts: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    return null;
  },
});

export const Wallet = {};
export default walletSlice.reducer;
export * from './thunks';
