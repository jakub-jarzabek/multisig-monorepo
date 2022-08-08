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
   pub from:Pubkey,
    pub to:Pubkey,
    pub value:u64,}

#[derive(Accounts)]
pub struct CreateTransferTransaction<'info> {
    pub wallet: Box<Account<'info, Wallet>>,
    #[account(zero, signer)]
    pub transaction: Box<Account<'info, TransferTransaction>>,
    pub initiator: Signer<'info>,

    
}
#[derive(Accounts)]
pub struct ExecuteTransferTransaction<'info> {
   #[account(mut)]
    /// CHECK: This is not dangerous
    pub from: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous
    pub to: AccountInfo<'info>,
    #[account()]
    pub system_program: Program<'info, System>,
    pub user: Signer<'info>,
     #[account(constraint = wallet.owner_seq == transaction.owner_seq)]
     pub wallet: Box<Account<'info, Wallet>>,
     #[account(mut, has_one = wallet)]
     pub transaction: Box<Account<'info, TransferTransaction>>,
    
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
