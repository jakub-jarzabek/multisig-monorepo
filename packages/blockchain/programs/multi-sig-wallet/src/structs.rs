use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program;

#[derive(Accounts)]
pub struct Createwallet<'info> {
    #[account(zero, signer)]
    pub wallet: Box<Account<'info, Wallet>>,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    pub wallet: Box<Account<'info, Wallet>>,
    #[account(zero, signer)]
    pub transaction: Box<Account<'info, Transaction>>,
    pub initiator: Signer<'info>,
    
}


#[derive(Accounts)]
pub struct Approve<'info> {
    #[account(constraint = wallet.owner_seq == transaction.owner_seq)]
    pub wallet: Box<Account<'info, Wallet>>,
    #[account(mut, has_one = wallet)]
    pub transaction: Box<Account<'info, Transaction>>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    /// CHECK: This is not dangerous
    pub from: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous
    pub to: AccountInfo<'info>,
    #[account()]
    pub system_program: Program<'info, System>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Test<'info> {
    pub user: Signer<'info>,


}

#[derive(Accounts)]
pub struct Auth<'info> {
    #[account(mut)]
    pub wallet: Box<Account<'info, Wallet>>,
    #[account(
        seeds = [wallet.key().as_ref()],
        bump = wallet.nonce,
    )]
    pub wallet_signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteTransaction<'info> {
    #[account(constraint = wallet.owner_seq == transaction.owner_seq)]
    pub wallet: Box<Account<'info, Wallet>>,
    #[account(
        seeds = [wallet.key().as_ref()],
        bump = wallet.nonce,
    )]
    /// CHECK: PDA program signer
    pub wallet_signer: UncheckedAccount<'info>,
    #[account(mut, has_one = wallet)]
    pub transaction: Box<Account<'info, Transaction>>,
}

// #[derive(Accounts)]
// pub struct ExecuteTransferTransaction<'info> {
//     #[account(constraint = wallet.owner_seq == transaction.owner_seq)]
//     pub wallet: Box<Account<'info, Wallet>>,
//     #[account(
//         seeds = [wallet.key().as_ref()],
//         bump = wallet.nonce,
//     )]
//     /// CHECK: PDA program signer
//     pub wallet_signer: UncheckedAccount<'info>,
//     #[account(mut, has_one = wallet)]
//     pub transaction: Box<Account<'info, TransferTransaction>>,
// }

#[account]
pub struct Wallet {
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
    pub nonce: u8,
    pub owner_seq: u32,
    pub num_transfer:u64
}

#[account]
pub struct Transaction {
    pub wallet: Pubkey,
    pub program_id: Pubkey,
    pub accounts: Vec<TransactionAccount>,
    pub data: Vec<u8>,
    pub signers: Vec<bool>,
    pub did_execute: bool,
    pub owner_seq: u32,
    pub tx_type: u8,
    pub tx_data: Vec<Pubkey>,
    pub tx_value: u64,
    pub deleted: bool
}

#[account]
pub struct TransferTransaction {
    pub wallet: Pubkey,
    pub program_id: Pubkey,
    pub accounts: Vec<TransactionAccount>,
    pub signers: Vec<bool>,
    pub did_execute: bool,
    pub owner_seq: u32,
    pub tx_type: u8,
    pub tx_data: Vec<Pubkey>,
    pub tx_value: u64,
    pub deleted: bool,
    pub instructions:Vec<TXInstruction>,


}
// Special Transfer Canse#[derive(Accounts)]
#[derive(Accounts)]
#[instruction(bump: u8, instructions: Vec<TXInstruction>)]
pub struct CreateTransferTransaction<'info> {
    /// The [SmartWallet].
    #[account(mut)]
    pub wallet: Account<'info, Wallet>,
    /// The [Transaction].
    #[account(
        init,
        seeds = [
            b"QbeetsuTransaction".as_ref(),
            wallet.key().to_bytes().as_ref(),
            wallet.num_transfer.to_le_bytes().as_ref()
        ],
        bump,
        payer = payer,
        space = TransferTransaction::space(instructions),
    )]
    pub transaction: Account<'info, TransferTransaction>,
    pub proposer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTransferTransaction<'info> {
    pub wallet: Account<'info, Wallet>,
    #[account(mut)]
    pub transaction: Account<'info, TransferTransaction>,
    pub owner: Signer<'info>,
}
// End Of special Transfer Case

impl From<&Transaction> for Instruction {
    fn from(tx: &Transaction) -> Instruction {
        Instruction {
            program_id: tx.program_id,
            accounts: tx.accounts.iter().map(Into::into).collect(),
            data: tx.data.clone(),
        }
    }
}


impl TransferTransaction {
    /// Computes the space a [Transaction] uses.
    pub fn space(instructions: Vec<TXInstruction>) -> usize {
        4  // Anchor discriminator
            + std::mem::size_of::<TransferTransaction>()
            + 4 // Vec discriminator
            + (instructions.iter().map(|ix| ix.space()).sum::<usize>())
    }

    /// Number of signers.
    pub fn num_signers(&self) -> usize {
        self.signers.iter().filter(|&did_sign| *did_sign).count()
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default, PartialEq)]
pub struct TXInstruction {
    /// Pubkey of the instruction processor that executes this instruction
    pub program_id: Pubkey,
    /// Metadata for what accounts should be passed to the instruction processor
    pub keys: Vec<TXAccountMeta>,
    /// Opaque data passed to the instruction processor
    pub data: Vec<u8>,
}

impl TXInstruction {
    /// Space that a [TXInstruction] takes up.
    pub fn space(&self) -> usize {
        std::mem::size_of::<Pubkey>()
            + (self.keys.len() as usize) * std::mem::size_of::<TXAccountMeta>()
            + (self.data.len() as usize)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, PartialEq, Copy, Clone)]
pub struct TXAccountMeta {
    /// An account's public key
    pub pubkey: Pubkey,
    /// True if an Instruction requires a Transaction signature matching `pubkey`.
    pub is_signer: bool,
    /// True if the `pubkey` can be loaded as a read-write account.
    pub is_writable: bool,
}

impl From<&TXInstruction> for solana_program::instruction::Instruction {
    fn from(tx: &TXInstruction) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: tx.program_id,
            accounts: tx.keys.clone().into_iter().map(Into::into).collect(),
            data: tx.data.clone(),
        }
    }
}

impl From<TXAccountMeta> for solana_program::instruction::AccountMeta {
    fn from(
        TXAccountMeta {
            pubkey,
            is_signer,
            is_writable,
        }: TXAccountMeta,
    ) -> solana_program::instruction::AccountMeta {
        solana_program::instruction::AccountMeta {
            pubkey,
            is_signer,
            is_writable,
        }
    }
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransactionAccount {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}
