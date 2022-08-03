import { IConnectionSlice } from './connection';
import { IWalletSlice } from './wallet';

export * from './connection';
export * from './wallet';

export interface ReduxState {
  connection: IConnectionSlice;
  wallet: IWalletSlice;
}
