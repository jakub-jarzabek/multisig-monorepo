import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnchorProvider, Program } from "@project-serum/anchor";
import Moralis from "moralis-v1";
import {
  Commitment,
  ConfirmOptions,
  Connection as Web3Connection,
  PublicKey,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import idl from "../../../solana-config/multi_sig_wallet.json";
import { MultiSigWallet } from "../../../solana-config/multi_sig_wallet";
import {
  createWallet,
  fetchWallet,
  logInToWallet,
  setOwners,
  setTreshold,
  transfer,
} from "./thunks";
export interface IConnectionSlice {
  provider: AnchorProvider;
  program: Program<MultiSigWallet>;
  msig: string;
  web3: Web3Connection;
  myWallets: string[];
  loading: boolean;
  chain: "sol" | "eth";
  account?: string;
}

const initialState: IConnectionSlice = {
  provider: null,
  msig: null,
  program: null,
  web3: null,
  myWallets: null,
  loading: false,
  chain: "sol",
  account: null,
};
interface IsetProviderPayload {
  wallet: WalletContextState | any;
}
const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setProviderAndProgram(state, action: PayloadAction<IsetProviderPayload>) {
      if (state.chain === "sol") {
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
      } else {
        const ethers = Moralis.web3Library;
      }
    },
    setWallet(state, action: PayloadAction<string>) {
      state.msig = action.payload;
    },
    setChain(state, action: PayloadAction<"sol" | "eth">) {
      state.chain = action.payload;
    },
    setAccount(state, action: PayloadAction<string>) {
      state.account = action.payload;
    },
    clearMsig(state) {
      state.msig = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createWallet.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createWallet.fulfilled, (state, action) => {
      state.msig = action.payload;
      state.loading = false;
    });
    builder.addCase(logInToWallet.fulfilled, (state, action) => {
      state.msig = action.payload;
      state.loading = false;
    });
    builder.addCase(logInToWallet.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchWallet.fulfilled, (state, action) => {
      state.myWallets = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchWallet.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(setOwners.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(setOwners.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(setTreshold.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(setTreshold.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(transfer.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(transfer.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

const { setProviderAndProgram, setWallet, clearMsig, setChain, setAccount } =
  connectionSlice.actions;
export const Connection = {
  setProviderAndProgram,
  setWallet,
  clearMsig,
  setChain,
  setAccount,
};
export default connectionSlice.reducer;
export * from "./thunks";
