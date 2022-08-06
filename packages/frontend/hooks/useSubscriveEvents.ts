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

    const listener_1 = program.addEventListener(
      'WalletCreatedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const listener_2 = program.addEventListener(
      'WalletOwnersSetEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const listener_3 = program.addEventListener(
      'WalletThresholdSetEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const listener_4 = program.addEventListener(
      'TransactionCreatedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const listener_5 = program.addEventListener(
      'ApprovedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const listener_6 = program.addEventListener(
      'DeletedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );
    const listener_7 = program.addEventListener(
      'TransactionExecutedEvent',
      (event, slot) => {
        console.log({ e: event });
        callback();
      }
    );

    const listener_8 = program.addEventListener(
      'TransferExecutedEvent',
      (event, slot) => {
        console.log(event);
        callback();
      }
    );
    return () => {
      program.removeEventListener(listener_1);
      program.removeEventListener(listener_2);
      program.removeEventListener(listener_3);
      program.removeEventListener(listener_4);
      program.removeEventListener(listener_5);
      program.removeEventListener(listener_6);
      program.removeEventListener(listener_7);
      program.removeEventListener(listener_8);
    };
  }, []);
};
