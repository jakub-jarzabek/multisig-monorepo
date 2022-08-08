import { MultiSigWallet } from 'packages/solana/target/types/multi_sig_wallet';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { BN } from 'bn.js';
import { assert } from 'chai';
import Assert from 'assert';
import { Keypair, PublicKey } from '@solana/web3.js';

describe('Wallet creation', async () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.MultiSigWallet as Program<MultiSigWallet>;
  const connection = new anchor.web3.Connection(
    'http://localhost:8899',
    'processed'
  );
  let walletSigner,
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
      console.log(err);
      const error = err.error;
      assert.strictEqual(
        error.errorMessage,
        'Threshold must be grater than zero and less than or equal to the number of owners.'
      );
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
      console.log(err);
      const error = err.error;
      assert.strictEqual(error.errorMessage, 'Owners must be unique');
    }
  });
  // it('It should fire event', async () => {
  //   let listener = null;

  //   let [event, slot] = await new Promise(async (resolve, _reject) => {
  //     listener = program.addEventListener(
  //       'WalletCreatedEvent',
  //       (event, slot) => {
  //         resolve([event, slot]);
  //         console.log('a');
  //       }
  //     );
  //     console.log('b');

  //     const x = program.rpc.createWallet(owners, threshold, nonce, {
  //       accounts: {
  //         wallet: wallet.publicKey,
  //       },
  //       instructions: [ix],
  //       signers: [wallet],
  //     });
  //     console.log(x);
  //   });
  //   listener && (await program.removeEventListener(listener));

  //   assert.isAbove(slot, 0);
  //   assert.strictEqual(event.data.toNumber(), 5);
  //   assert.strictEqual(event.label, 'hello');
  // });
});
