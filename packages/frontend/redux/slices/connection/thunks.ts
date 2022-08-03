import { createAsyncThunk } from '@reduxjs/toolkit';
import { IConnectionSlice } from '.';
import { PublicKey } from '@solana/web3.js';
import { web3, BN } from '@project-serum/anchor';

interface IcreateWallet {
  additionalAccounts?: PublicKey[];
}
export const createWallet = createAsyncThunk(
  'payload/createWallet',
  async (args: IcreateWallet, thunkAPI) => {
    const baseAccount = web3.Keypair.generate();
    const state = thunkAPI.getState() as { connection: IConnectionSlice };
    const pK = state.connection.provider.publicKey as PublicKey;
    try {
      const tx = await state.connection.program.rpc.createWallet(
        [pK, ...args.additionalAccounts],
        new BN(1),
        new BN(0),
        {
          accounts: { wallet: baseAccount.publicKey },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              baseAccount,
              200
            ),
          ],
          signers: [baseAccount],
        }
      );
      console.log({ tx: tx });
    } catch (err) {
      console.log(err);
    }
    return baseAccount.publicKey.toString();
  }
);

interface IsetOwners extends IcreateWallet {
  walletPublicKey: PublicKey;
  signer: PublicKey;
}
export const setOwners = createAsyncThunk(
  'payload/setOwners',
  async (args: IsetOwners, thunkAPI) => {
    const state = thunkAPI.getState() as { connection: IConnectionSlice };
    const pK = state.connection.provider.publicKey as PublicKey;
    const newOwners: PublicKey[] = [pK, ...args.additionalAccounts] || [];
    const data = state.connection.program.coder.instruction.encode(
      'set_owners',
      { owners: newOwners }
    );
    const accounts = [
      {
        pubkey: args.walletPublicKey,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: args.signer,
        isWritable: false,
        isSigner: true,
      },
    ];
    const transaction = web3.Keypair.generate();
    try {
      const tx = await state.connection.program.rpc.createTransaction(
        state.connection.program.programId,
        accounts,
        data,
        {
          accounts: {
            wallet: args.walletPublicKey,
            transaction: transaction.publicKey,
            initiator: state.connection.provider.publicKey,
          },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              transaction,
              2000
            ),
          ],
          signers: [transaction],
        }
      );
      console.log({ tx: tx });
    } catch (err) {
      console.log(err);
    }
  }
);
