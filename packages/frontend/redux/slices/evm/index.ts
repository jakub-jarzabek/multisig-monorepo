import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnchorProvider, Program } from "@project-serum/anchor";
import Moralis from "moralis-v1";
import { Web3Provider } from "@ethersproject/providers";
import MultisigDB from "../../../evm-config/MultisigDB.json";
import MultisigAddresses from "../../../evm-config/ethereum.json";
import { Contract } from "ethers";

export interface IEvmSlice {
  provider: Web3Provider;
  DB: any;
  wallet: string;
}

const initialState: IEvmSlice = {
  provider: null,
  DB: null,
  wallet: null,
};

const evmSlice = createSlice({
  name: "evm",
  initialState,
  reducers: {
    setProviderAndDB(state) {
      let provider;
      if (typeof window !== "undefined") {
        provider = new Moralis.web3Library.providers.Web3Provider(
          window?.ethereum
        );
        const contract = new Moralis.web3Library.Contract(
          MultisigAddresses.DB,
          MultisigDB.abi,
          provider
        );
        state.provider = provider;
        state.DB = contract;
      }
    },
    setWallet(state, action: PayloadAction<string>) {
      state.wallet = action.payload;
    },
  },
  extraReducers: (builder) => {
    return null;
  },
});

const { setProviderAndDB, setWallet } = evmSlice.actions;
export const Evm = { setProviderAndDB, setWallet };
export default evmSlice.reducer;
