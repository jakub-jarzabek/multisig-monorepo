import { MultiSigWallet } from 'packages/solana/target/types/multi_sig_wallet';
import * as anchor from '@project-serum/anchor';
import { AnchorError, Program } from '@project-serum/anchor';
import { BN } from 'bn.js';
import { assert } from 'chai';
import Assert from 'assert';
import { Keypair, PublicKey } from '@solana/web3.js';

describe('Transaction Managment', async () => {
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

    threshold = new anchor.BN(1);

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
    const data = program.coder.instruction.encode('change_threshold', {
      threshold: new BN(5),
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

  it('Should should be signed from start', async () => {
    const tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.equal(tx.signers[0], true);
  });
  it('Should not be deleted from start', async () => {
    const tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.equal(tx.deleted, false);
  });
  it('Should should change approval', async () => {
    await program.rpc.cancelApproval({
      accounts: {
        wallet: wallet.publicKey,
        transaction: transaction.publicKey,
        owner: ownerA.publicKey,
      },
      signers: [ownerA],
    });

    const tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.equal(tx.signers[0], false);
  });
  it('Should should delete un aproved transaction', async () => {
    await program.rpc.cancelApproval({
      accounts: {
        wallet: wallet.publicKey,
        transaction: transaction.publicKey,
        owner: ownerA.publicKey,
      },
      signers: [ownerA],
    });
    await program.rpc.deleteTransaction({
      accounts: {
        wallet: wallet.publicKey,
        transaction: transaction.publicKey,
        owner: ownerA.publicKey,
      },
      signers: [ownerA],
    });

    const tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.equal(tx.deleted, true);
  });
});
