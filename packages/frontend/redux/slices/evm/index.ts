import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { WritableDraft } from "immer/dist/internal";
import { AnchorProvider, Program } from "@project-serum/anchor";
import Moralis from "moralis-v1";
import { Web3Provider } from "@ethersproject/providers";
import MultisigFactory from "../../../evm-config/MultisigFactory.json";
import MultisigAddresses from "../../../evm-config/ethereum.json";
import Multisig from "../../../evm-config/Multisig.json";
import { Contract } from "ethers";
import { ReduxState } from "..";
import { Multisig as MultisigT } from "../../../evm-config/Multisig";
import { MultisigFactory as MultisigFactoryT } from "../../../evm-config/MultisigFactory";

export interface IEvmSlice {
  provider: Web3Provider;
  factory: any;
  walletContract: any;
  wallet: string;
}

const initialState: IEvmSlice = {
  provider: null,
  factory: null,
  wallet: null,
  walletContract: null,
};

const evmSlice = createSlice({
  name: "evm",
  initialState,
  reducers: {
    resetState: (state) => {
      state.factory = null;
      state.provider = null;
      state.wallet = null;
      state.walletContract = null;
    },
    setProviderAndDB(state) {
      let provider;
      if (typeof window !== "undefined") {
        provider = new Moralis.web3Library.providers.Web3Provider(
          window?.ethereum
        );
        const signer = provider.getSigner();
        const factoryAddress =
          process.env.NX_PUBLIC_PROD === "true"
            ? MultisigAddresses["Factory-prod"]
            : MultisigAddresses.Factory;
        const contract = new Moralis.web3Library.Contract(
          factoryAddress,
          MultisigFactory.abi,
          signer
        ) as unknown;
        state.provider = provider;
        state.factory = contract as WritableDraft<MultisigFactoryT>;
      }
    },
    setWallet(state, action: PayloadAction<string>) {
      state.wallet = action.payload;
    },
    setWalletContract(state, action) {
      const contract = new Moralis.web3Library.Contract(
        action.payload,
        Multisig.abi,
        state.provider.getSigner()
      ) as unknown;
      state.walletContract = contract as WritableDraft<MultisigT>;
    },
  },
  extraReducers: (builder) => {
    return null;
  },
});

const { setProviderAndDB, setWallet, setWalletContract, resetState } =
  evmSlice.actions;
export const Evm = {
  setProviderAndDB,
  setWallet,
  setWalletContract,
  resetState,
};
export default evmSlice.reducer;
