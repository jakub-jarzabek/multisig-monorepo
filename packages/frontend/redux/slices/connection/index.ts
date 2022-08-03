import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnchorProvider, Program } from '@project-serum/anchor';
import {
  Commitment,
  ConfirmOptions,
  Connection as Web3Connection,
  PublicKey,
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import idl from '@blockchain/target/idl/multi_sig_wallet.json';
import { MultiSigWallet } from '../../../tempTypes/multi_sig_wallet';
import { createWallet } from './thunks';
export interface IConnectionSlice {
  provider: AnchorProvider;
  program: Program<MultiSigWallet>;
  msig: string;
}

const initialState: IConnectionSlice = {
  provider: null,
  msig: null,
  program: null,
};
interface IsetProviderPayload {
  wallet: WalletContextState;
}
const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setProviderAndProgram(state, action: PayloadAction<IsetProviderPayload>) {
      const connection = new Web3Connection(
        process.env.NEXT_PUBLIC_NETWORK,
        process.env.NEXT_PUBLIC_COMMITMENT as Commitment
      );
      state.provider = new AnchorProvider(
        connection,
        action.payload.wallet,
        process.env.NEXT_PUBLIC_COMMITMENT as ConfirmOptions
      );
      const programID = new PublicKey(idl.metadata.address);
      state.program = new Program(
        JSON.parse(JSON.stringify(idl)),
        programID,
        state.provider
      ) as Program<MultiSigWallet>;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createWallet.fulfilled, (state, action) => {
      state.msig = action.payload;
    });
  },
});

const { setProviderAndProgram } = connectionSlice.actions;
export const Connection = { setProviderAndProgram };
export default connectionSlice.reducer;
export * from './thunks';
