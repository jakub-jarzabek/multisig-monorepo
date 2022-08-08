import { MultiSigWallet } from 'packages/solana/target/types/multi_sig_wallet';
import * as anchor from '@project-serum/anchor';
import { AnchorError, Program } from '@project-serum/anchor';
import { BN } from 'bn.js';
import { assert } from 'chai';
import Assert from 'assert';
import { Keypair, PublicKey } from '@solana/web3.js';

describe('Wallet and transaction creation', async () => {
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
    wallet: any;

  beforeEach(async () => {
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
  });

  it('Should create wallet', async () => {
    await program.rpc.createWallet(owners, threshold, nonce, {
      accounts: {
        wallet: wallet.publicKey,
      },
      instructions: [ix],
      signers: [wallet],
    });
    let walletAccount = await program.account.wallet.fetch(wallet.publicKey);
    assert.strictEqual(walletAccount.nonce, nonce);
    assert.deepStrictEqual(walletAccount.owners, owners);
  });
  it('Should fail - treshold too big', async () => {
    const tooBigThreshold = new anchor.BN(3);
    try {
      await program.rpc.createWallet(owners, tooBigThreshold, nonce, {
        accounts: {
          wallet: wallet.publicKey,
        },
        instructions: [ix],
        signers: [wallet],
      });
      assert.fail();
    } catch (err) {
      if (err instanceof AnchorError) {
        const error = err.error;
        assert.strictEqual(
          error.errorMessage,
          'Threshold must be grater than zero and less than or equal to the number of owners.'
        );
      }
    }
  });
  it('Should fail - owners not unique', async () => {
    const own = [ownerA.publicKey, ownerA.publicKey];
    try {
      await program.rpc.createWallet(own, threshold, nonce, {
        accounts: {
          wallet: wallet.publicKey,
        },
        instructions: [ix],
        signers: [wallet],
      });
      assert.fail();
    } catch (err) {
      if (err instanceof AnchorError) {
        const error = err.error;
        assert.strictEqual(error.errorMessage, 'Owners must be unique');
      }
    }
  });
  it('Should create transactions set Owner', async () => {
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
    await program.rpc.createWallet(owners, threshold, nonce, {
      accounts: {
        wallet: wallet.publicKey,
      },
      instructions: [ix],
      signers: [wallet],
    });
    const accs = [ownerC.publicKey];
    const data = program.coder.instruction.encode('set_owners', {
      owners: accs,
    });
    const transaction = anchor.web3.Keypair.generate();
    await program.rpc.createTransaction(
      program.programId,
      accounts,
      data,
      new BN(0),
      accs,
      new BN(0),
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

    let tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.deepStrictEqual(tx.accounts, accounts);
    assert.deepStrictEqual(tx.didExecute, false);
    assert.deepStrictEqual(tx.txType.toString(), '0');
    assert.deepStrictEqual(tx.txData, [ownerC.publicKey]);
  });
  it('Should create transactions set threshold', async () => {
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
    const transaction = anchor.web3.Keypair.generate();
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

    let tx = await program.account.transaction.fetch(transaction.publicKey);
    assert.deepStrictEqual(tx.accounts, accounts);
    assert.deepStrictEqual(tx.didExecute, false);
    assert.deepStrictEqual(tx.txType.toString(), '1');
    assert.deepStrictEqual(tx.txValue.toString(), '5');
  });
  it('Should create transactions transfer', async () => {
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
    await program.rpc.createWallet(owners, threshold, nonce, {
      accounts: {
        wallet: wallet.publicKey,
      },
      instructions: [ix],
      signers: [wallet],
    });
    const accs = [ownerC.publicKey];
    const transaction = anchor.web3.Keypair.generate();
    await program.rpc.createTransferTransaction(
      program.programId,
      accounts,
      new BN(2),
      accs,
      new BN(100),
      wallet.publicKey,
      ownerB.publicKey,
      new BN(100),
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

    let tx = await program.account.transferTransaction.fetch(
      transaction.publicKey
    );
    assert.deepStrictEqual(tx.accounts, accounts);
    assert.deepStrictEqual(tx.didExecute, false);
    assert.deepStrictEqual(tx.txType.toString(), '2');
    assert.deepStrictEqual(tx.txValue.toString(), '100');
  });
});
