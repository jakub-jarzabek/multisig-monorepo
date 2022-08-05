import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnchorProvider, Program } from '@project-serum/anchor';
import {
  Commitment,
  ConfirmOptions,
  Connection as Web3Connection,
  PublicKey,
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import idl from '@solana/target/idl/multi_sig_wallet.json';
import { MultiSigWallet } from '../../../tempTypes/multi_sig_wallet';
import { createWallet, fetchWallet, logInToWallet } from './thunks';
export interface IConnectionSlice {
  provider: AnchorProvider;
  program: Program<MultiSigWallet>;
  msig: string;
  web3: Web3Connection;
  myWallets: string[];
}

const initialState: IConnectionSlice = {
  provider: null,
  msig: null,
  program: null,
  web3: null,
  myWallets: null,
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
      state.web3 = connection;
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
    setWallet(state, action: PayloadAction<string>) {
      state.msig = action.payload;
    },
    clearMsig(state) {
      state.msig = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createWallet.fulfilled, (state, action) => {
      state.msig = action.payload;
    });
    builder.addCase(logInToWallet.fulfilled, (state, action) => {
      state.msig = action.payload;
    });
    builder.addCase(fetchWallet.fulfilled, (state, action) => {
      state.myWallets = action.payload;
    });
  },
});

const { setProviderAndProgram, setWallet, clearMsig } = connectionSlice.actions;
export const Connection = { setProviderAndProgram, setWallet, clearMsig };
export default connectionSlice.reducer;
export * from './thunks';
