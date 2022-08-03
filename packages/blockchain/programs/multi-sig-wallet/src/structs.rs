use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;

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

#[account]
pub struct Wallet {
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
    pub nonce: u8,
    pub owner_seq: u32,
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
}

impl From<&Transaction> for Instruction {
    fn from(tx: &Transaction) -> Instruction {
        Instruction {
            program_id: tx.program_id,
            accounts: tx.accounts.iter().map(Into::into).collect(),
            data: tx.data.clone(),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransactionAccount {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}
