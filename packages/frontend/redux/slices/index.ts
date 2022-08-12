import { WritableDraft } from "immer/dist/internal";
import { IConnectionSlice } from "./connection";
import { IWalletSlice } from "./wallet";
import { IEvmSlice } from "./evm";

export * from "./connection";
export * from "./wallet";
export * from "./evm";

export interface ReduxState {
  connection: WritableDraft<IConnectionSlice>;
  wallet: WritableDraft<IWalletSlice>;
  evm: WritableDraft<IEvmSlice>;
}
