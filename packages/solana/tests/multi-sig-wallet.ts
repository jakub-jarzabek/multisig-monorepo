// import { MultiSigWallet } from 'packages/solana/target/types/multi_sig_wallet';
// import * as anchor from '@project-serum/anchor';
// import { Program } from '@project-serum/anchor';
// import { BN } from 'bn.js';

// describe('multi-sig-wallet', () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.MultiSigWallet as Program<MultiSigWallet>;
//   console.log(program.programId);

//   it('Tests the multisig program', async () => {
//     const wallet = anchor.web3.Keypair.generate();
//     const wallet2 = anchor.web3.Keypair.generate();

//     const [walletSigner, nonce] =
//       await anchor.web3.PublicKey.findProgramAddress(
//         [wallet.publicKey.toBuffer()],
//         program.programId
//       );
//     const [walletSigner2, nonce2] =
//       await anchor.web3.PublicKey.findProgramAddress(
//         [wallet.publicKey.toBuffer()],
//         program.programId
//       );
//     const multisigSize = 200; // Big enough.

//     const ownerA = anchor.web3.Keypair.generate();
//     const ownerB = anchor.web3.Keypair.generate();
//     const ownerC = anchor.web3.Keypair.generate();

//     const owners = [ownerA.publicKey];
//     const owners2 = [ownerC.publicKey];

//     const threshold = new anchor.BN(1);
//     await program.rpc.createWallet(owners, threshold, nonce, {
//       accounts: {
//         wallet: wallet.publicKey,
//       },
//       instructions: [
//         await program.account.wallet.createInstruction(wallet, multisigSize),
//       ],
//       signers: [wallet],
//     });
//     await program.rpc.createWallet(owners2, threshold, nonce2, {
//       accounts: {
//         wallet: wallet2.publicKey,
//       },
//       instructions: [
//         await program.account.wallet.createInstruction(wallet2, multisigSize),
//       ],
//       signers: [wallet2],
//     });
//     const connection = new anchor.web3.Connection(
//       'http://localhost:8899',
//       'processed'
//     );
//     await connection.requestAirdrop(wallet.publicKey, 1000000000);
//     await connection.requestAirdrop(wallet2.publicKey, 1000000000);
//     await connection.requestAirdrop(ownerB.publicKey, 1000000000);
//     await connection.requestAirdrop(ownerA.publicKey, 1000000000);
//     const balance = await connection.getBalance(wallet.publicKey);

//     await program.rpc.transferFunds(new BN(2), {
//       accounts: {
//         from: wallet.publicKey,
//         to: ownerB.publicKey,
//         systemProgram: anchor.web3.SystemProgram.programId,
//         user: ownerA.publicKey,
//       },
//       signers: [ownerA],
//     });
//   });
// });
