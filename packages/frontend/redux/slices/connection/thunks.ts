import { createAsyncThunk } from "@reduxjs/toolkit";
import { IConnectionSlice } from ".";
import { PublicKey } from "@solana/web3.js";
import { web3, BN, AnchorError } from "@project-serum/anchor";
import { ReduxState } from "..";
import { toast } from "react-toastify";
import { TransactionType } from "../../../constants";
import Moralis from "moralis-v1";
import Addresses from "../../../evm-config/ethereum.json";
import Multisig from "../../../evm-config/Multisig.json";

const SIZE = 1000;
interface IcreateWallet {
  additionalAccounts?: PublicKey[] | string[];
}
export const createWallet = createAsyncThunk(
  "payload/createWallet",
  async (args: IcreateWallet, thunkAPI) => {
    const baseAccount = web3.Keypair.generate();

    const state = thunkAPI.getState() as ReduxState;
    try {
      if (state.connection.chain === "sol") {
        const [walletSigner, nonce] = await web3.PublicKey.findProgramAddress(
          [baseAccount.publicKey.toBuffer()],
          state.connection.program.programId
        );

        const pK = state.connection.provider.publicKey as PublicKey;
        await state.connection.program.rpc.createWallet(
          [pK, ...(args.additionalAccounts as PublicKey[])],
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
      } else {
        console.log("else");

        const tx = await state.evm.factory.createMultiSig(
          [state.evm.wallet, ...(args.additionalAccounts as string[])],
          1
        );
        const receipt = await tx.wait();
        const wallets = await state.evm.factory.getUserWallets()
        console.log(wallets)
        return wallets[wallets.length-1].walletAddress.toString()
      }
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        toast.error(err.message);
      }
      console.log(err);
    }
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
      if (state.connection.chain === "sol") {
        console.log("sol");
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
      } else {
        console.log("evm");
        return args.pk;
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
    const state = thunkAPI.getState() as ReduxState;
    try {
      if (state.connection.chain === "sol") {
        const pK = state.connection.provider.publicKey as PublicKey;
        const newOwners: PublicKey[] =
          (args.additionalAccounts as PublicKey[]) || [];
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
      } else {
        const threshold = 0;
        const owners = args.additionalAccounts as string[];
        const value = 0;
        const data = "0x";
        const to = state.evm.walletContract.address;

        const tx = await state.evm.walletContract.addTransaction(
          to,
          value,
          data,
          owners,
          threshold,
          TransactionType.SET_OWNERS
        );
        const receipt = tx.wait();
      }
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
    const state = thunkAPI.getState() as ReduxState;

    try {
      if (state.connection.chain === "sol") {
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
      } else {
        const threshold = args.threshold;
        const owners = [];
        const value = 0;
        const data = "0x";
        const to = state.evm.walletContract.address;

        const tx = await state.evm.walletContract.addTransaction(
          to,
          value,
          data,
          owners,
          threshold,
          TransactionType.SET_THRESHOLD
        );
        const receipt = tx.wait();
      }
      toast.success("Transaction created and signed");
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    return true;
  }
);

interface ITransfer {
  to: PublicKey|string;
  amount: number;
}

export const transfer = createAsyncThunk(
  "payload/transfer",
  async (args: ITransfer, thunkAPI) => {
    const state = thunkAPI.getState() as ReduxState;

    try {
      if (state.connection.chain === "sol") {
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
      } else {
        const threshold = 0;
        const owners = [];
        const value = args.amount;
        const data = "0x";
        const to = args.to;

        const tx = await state.evm.walletContract.addTransaction(
          args.to,
          value,
          data,
          owners,
          threshold,
          TransactionType.TRANSFER
        );
        const receipt = tx.wait();
      }
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
        const data = await state.evm.factory.getUserWallets();

        return data.map((wallet) => wallet.walletAddress);
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
