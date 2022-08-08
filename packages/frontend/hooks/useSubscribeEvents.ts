import { useEffect } from 'react';
import {
  Connection,
  Commitment,
  ConfirmOptions,
  PublicKey,
} from '@solana/web3.js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { MultiSigWallet } from '../solana-config/multi_sig_wallet';
import idl from '../solana-config/multi_sig_wallet.json';

export const useSubscriveEvents = (callback: () => void, wallet) => {
  useEffect(() => {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_NETWORK,
      process.env.NEXT_PUBLIC_COMMITMENT as Commitment
    );
    const provider = new AnchorProvider(
      connection,
      wallet,
      process.env.NEXT_PUBLIC_COMMITMENT as ConfirmOptions
    );
    const programID = new PublicKey(idl.metadata.address);
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      provider
    ) as Program<MultiSigWallet>;
    console.log({ sub_program: program });

    const walletCreatedListener = program.addEventListener(
      'WalletCreatedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const ownersSetListener = program.addEventListener(
      'WalletOwnersSetEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const tresholdSetListener = program.addEventListener(
      'WalletThresholdSetEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const transactionCreatedListener = program.addEventListener(
      'TransactionCreatedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const approvedListener = program.addEventListener(
      'ApprovedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const deletedListener = program.addEventListener(
      'DeletedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const transactionExecutedListener = program.addEventListener(
      'TransactionExecutedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const transferExecutedListener = program.addEventListener(
      'TransferExecutedEvent',
      (event, slot) => {
        console.log(event);
        callback();
      }
    );
    return () => {
      program.removeEventListener(transactionCreatedListener);
      program.removeEventListener(transactionExecutedListener);
      program.removeEventListener(transferExecutedListener);
      program.removeEventListener(approvedListener);
      program.removeEventListener(deletedListener);
      program.removeEventListener(walletCreatedListener);
      program.removeEventListener(tresholdSetListener);
      program.removeEventListener(ownersSetListener);
    };
  }, []);
};
