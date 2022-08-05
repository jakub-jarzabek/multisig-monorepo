import { WritableDraft } from 'immer/dist/internal';
import { IConnectionSlice } from './connection';
import { IWalletSlice } from './wallet';

export * from './connection';
export * from './wallet';

export interface ReduxState {
  connection: WritableDraft<IConnectionSlice>;
  wallet: WritableDraft<IWalletSlice>;
}
