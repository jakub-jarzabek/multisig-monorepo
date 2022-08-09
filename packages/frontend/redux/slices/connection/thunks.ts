import { createAsyncThunk } from "@reduxjs/toolkit";
import { IConnectionSlice } from ".";
import { PublicKey } from "@solana/web3.js";
import { web3, BN, AnchorError } from "@project-serum/anchor";
import { ReduxState } from "..";
import { toast } from "react-toastify";

const SIZE = 1000;
interface IcreateWallet {
  additionalAccounts?: PublicKey[];
}
export const createWallet = createAsyncThunk(
  "payload/createWallet",
  async (args: IcreateWallet, thunkAPI) => {
    const baseAccount = web3.Keypair.generate();

    const state = thunkAPI.getState() as ReduxState;
    const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
      [baseAccount.publicKey.toBuffer()],
      state.connection.program.programId
    );
    const pK = state.connection.provider.publicKey as PublicKey;
    try {
      await state.connection.program.rpc.createWallet(
        [pK, ...args.additionalAccounts],
        new BN(1),
        nonce,
        {
          accounts: { wallet: baseAccount.publicKey },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              baseAccount,
              SIZE
            ),
          ],
          signers: [baseAccount],
        }
      );
      return baseAccount.publicKey.toString();
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }
    return null;
  }
);

interface IlogInToWallet {
  pk: string;
}
export const logInToWallet = createAsyncThunk(
  "payload/LogInToWallet",
  async (args: IlogInToWallet, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;

    try {
      data = await state.connection.program.account.wallet.fetch(args.pk);
      if (
        data.owners
          .map((owner) => owner.toString())
          .includes(state.connection.provider.publicKey.toString())
      ) {
        return args.pk;
      } else {
        toast.error("Unauthorized for this wallet");
        throw new Error("Unauthorized");
      }
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return null;
  }
);

interface IsetOwners extends IcreateWallet {
  signer: PublicKey;
}
export const setOwners = createAsyncThunk(
  "payload/setOwners",
  async (args: IsetOwners, thunkAPI) => {
    const state = thunkAPI.getState() as { connection: IConnectionSlice };
    const pK = state.connection.provider.publicKey as PublicKey;
    const newOwners: PublicKey[] = args.additionalAccounts || [];
    const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
      [new PublicKey(state.connection.msig).toBuffer()],
      state.connection.program.programId
    );
    const data = state.connection.program.coder.instruction.encode(
      "set_owners",
      { owners: newOwners }
    );
    const accounts = [
      {
        pubkey: new PublicKey(state.connection.msig),
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: walletSigner,
        isWritable: false,
        isSigner: true,
      },
    ];
    const transaction = web3.Keypair.generate();
    try {
      await state.connection.program.rpc.createTransaction(
        state.connection.program.programId,
        accounts,
        data,
        new BN(0),
        newOwners,
        new BN(0),
        {
          accounts: {
            wallet: new PublicKey(state.connection.msig),
            transaction: transaction.publicKey,
            initiator: state.connection.provider.wallet.publicKey,
          },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              transaction,
              SIZE
            ),
          ],
          signers: [transaction],
        }
      );
      toast.success("Transaction created and signed");
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    return true;
  }
);
interface IsetTreshold {
  threshold: number;
}
export const setTreshold = createAsyncThunk(
  "payload/setTreshold",
  async (args: IsetTreshold, thunkAPI) => {
    const state = thunkAPI.getState() as { connection: IConnectionSlice };
    const [walletSigner] = await web3.PublicKey.findProgramAddress(
      [new PublicKey(state.connection.msig).toBuffer()],
      state.connection.program.programId
    );
    const data = state.connection.program.coder.instruction.encode(
      "change_threshold",
      { threshold: new BN(args.threshold) }
    );
    const accounts = [
      {
        pubkey: new PublicKey(state.connection.msig),
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: walletSigner,
        isWritable: false,
        isSigner: true,
      },
    ];
    const transaction = web3.Keypair.generate();
    try {
      await state.connection.program.rpc.createTransaction(
        state.connection.program.programId,
        accounts,
        data,
        new BN(1),
        [],
        new BN(args.threshold),
        {
          accounts: {
            wallet: new PublicKey(state.connection.msig),
            transaction: transaction.publicKey,
            initiator: state.connection.provider.wallet.publicKey,
          },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              transaction,
              SIZE
            ),
          ],
          signers: [transaction],
        }
      );
      toast.success("Transaction created and signed");
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    return true;
  }
);

interface ITransfer {
  to: PublicKey;
  amount: number;
}

export const transfer = createAsyncThunk(
  "payload/transfer",
  async (args: ITransfer, thunkAPI) => {
    const state = thunkAPI.getState() as { connection: IConnectionSlice };
    const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
      [new PublicKey(state.connection.msig).toBuffer()],
      state.connection.program.programId
    );

    const accounts = [
      {
        pubkey: new PublicKey(state.connection.msig),
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: walletSigner,
        isWritable: false,
        isSigner: true,
      },
    ];
    const transaction = web3.Keypair.generate();

    try {
      await state.connection.program.rpc.createTransferTransaction(
        state.connection.program.programId,
        accounts,
        new BN(2),
        [args.to],
        new BN(args.amount),
        new PublicKey(state.connection.msig),
        args.to,
        new BN(args.amount),
        {
          accounts: {
            wallet: new PublicKey(state.connection.msig),
            transaction: transaction.publicKey,
            initiator: state.connection.provider.wallet.publicKey,
          },
          instructions: [
            await state.connection.program.account.wallet.createInstruction(
              transaction,
              1000
            ),
          ],
          signers: [transaction],
        }
      );
      toast.success("Transaction created and signed");
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
    return true;
  }
);

export const fetchWallet = createAsyncThunk(
  "payload/fetchWallet",
  async (args, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;
    let data;

    try {
      if (state.connection.chain === "sol") {
        data = await state.connection.program.account.wallet.all();
        data = data.filter((wallet) =>
          wallet.account.owners
            .map((owner) => owner.toString())
            .includes(state.connection.provider.wallet.publicKey.toString())
        );
        return data.map((wallet) => wallet.publicKey.toString());
      } else {
        const data = await state.evm.DB.getWallets(state.evm.wallet);
        return data;
      }
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }

    return null;
  }
);
