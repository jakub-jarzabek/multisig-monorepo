import { MultiSigWallet } from 'packages/solana/target/types/multi_sig_wallet';
import * as anchor from '@project-serum/anchor';
import { AnchorError, Program } from '@project-serum/anchor';
import { BN } from 'bn.js';
import { assert } from 'chai';
import Assert from 'assert';
import { Keypair, PublicKey } from '@solana/web3.js';

describe('Fail Cases', async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.MultiSigWallet as Program<MultiSigWallet>;
  const connection = new anchor.web3.Connection(
    'http://localhost:8899',
    'processed'
  );

  let walletSigner: PublicKey,
    nonce: any,
    size,
    ownerA: Keypair,
    ownerB: Keypair,
    ownerC: Keypair,
    owners: PublicKey[],
    threshold: any,
    ix: any,
    wallet: any,
    transaction: Keypair;

  beforeEach(async () => {
    transaction = anchor.web3.Keypair.generate();
    wallet = anchor.web3.Keypair.generate();
    [walletSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer()],
      program.programId
    );
    size = 2000;
    ownerA = anchor.web3.Keypair.generate();
    ownerB = anchor.web3.Keypair.generate();
    ownerC = anchor.web3.Keypair.generate();

    owners = [ownerA.publicKey, ownerB.publicKey];

    threshold = new anchor.BN(2);

    ix = await program.account.wallet.createInstruction(wallet, size);

    await program.rpc.createWallet(owners, threshold, nonce, {
      accounts: {
        wallet: wallet.publicKey,
      },
      instructions: [ix],
      signers: [wallet],
    });
    const accounts = [
      {
        pubkey: wallet.publicKey,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: walletSigner,
        isWritable: false,
        isSigner: true,
      },
    ];
    const accs = [ownerC.publicKey];
    const data = program.coder.instruction.encode('set_owners', {
      owners: [ownerA.publicKey, ownerB.publicKey, ownerC.publicKey],
    });
    await program.rpc.createTransaction(
      program.programId,
      accounts,
      data,
      new BN(1),
      accs,
      new BN(5),
      {
        accounts: {
          wallet: wallet.publicKey,
          transaction: transaction.publicKey,
          initiator: ownerA.publicKey,
        },
        instructions: [
          await program.account.wallet.createInstruction(transaction, 2000),
        ],
        signers: [transaction, ownerA],
      }
    );
  });

  it('Should fail to execute transaction', async () => {
    try {
      await program.rpc.executeTransaction({
        accounts: {
          wallet: wallet.publicKey,
          walletSigner,
          transaction: transaction.publicKey,
        },
        //eslint-disable-next-line
        // @ts-ignore
        remainingAccounts: program.instruction.setOwners
          .accounts({
            wallet: wallet.publicKey,
            walletSigner,
          })

          //eslint-disable-next-line
          // @ts-ignore
          .map((meta) =>
            meta.pubkey.equals(walletSigner)
              ? { ...meta, isSigner: false }
              : meta
          )
          .concat({
            pubkey: program.programId,
            isWritable: false,
            isSigner: false,
          }),
      });
      assert.fail();
    } catch (err) {
      if (err instanceof AnchorError) {
        const error = err.error;
        assert.strictEqual(error.errorMessage, 'Not enough signers');
      }
    }
  });
  it('Should fail transaction deletion', async () => {
    try {
      await program.rpc.deleteTransaction({
        accounts: {
          wallet: wallet.publicKey,
          transaction: transaction.publicKey,
          owner: ownerA.publicKey,
        },
        signers: [ownerA],
      });
      assert.fail();
    } catch (err) {
      if (err instanceof AnchorError) {
        const error = err.error;
        assert.strictEqual(error.errorMessage, 'Transaction cannot be deleted');
      }
    }
  });
});
