use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program;
use std::convert::Into;
use std::ops::Deref;
use std::ops::Not;
mod events;
mod structs;
mod errors;
mod utils;

pub use events::*;
pub use structs::*;
pub use errors::ErrorCode;
pub use utils::*;

declare_id!("yqiXBbHxd9bQJ6u2bqjLkLvGQG4H9Nmxwfcivv2BLg3");

#[program]
pub mod multi_sig_wallet {
    use super::*;

    pub fn create_wallet(
        ctx: Context<Createwallet>,
        owners: Vec<Pubkey>,
        threshold: u64,
        nonce: u8,
    ) -> Result<()> {
        are_owners_unique(&owners)?;
        require!(
            threshold > 0 && threshold <= owners.len() as u64,
            InvalidThreshold
        );
        require!(!owners.is_empty(), ForbiddenLength);

        let wallet = &mut ctx.accounts.wallet;
        wallet.owners = owners;
        wallet.threshold = threshold;
        wallet.nonce = nonce;
        wallet.owner_seq = 0;
        Ok(())
    }

    pub fn create_transaction(
        ctx: Context<CreateTransaction>,
        pid: Pubkey,
        accs: Vec<TransactionAccount>,
        data: Vec<u8>,
        tx_type: u8,
        tx_data: Vec<Pubkey>,
        tx_value: u8,
    ) -> Result<()> {
        let owner_index = ctx
            .accounts
            .wallet
            .owners
            .iter()
            .position(|a| a == ctx.accounts.initiator.key)
            .ok_or(ErrorCode::UnauthorizedOwner)?;

        let mut signers = Vec::new();
        signers.resize(ctx.accounts.wallet.owners.len(), false);
        signers[owner_index] = true;

        let tx = &mut ctx.accounts.transaction;
        tx.program_id = pid;
        tx.accounts = accs;
        tx.data = data;
        tx.signers = signers;
        tx.wallet = ctx.accounts.wallet.key();
        tx.did_execute = false;
        tx.deleted = false;
        tx.owner_seq = ctx.accounts.wallet.owner_seq;
        tx.tx_type = tx_type;
        tx.tx_data = tx_data;

        Ok(())
    }

    // Approves a transaction on behalf of an owner of the wallet.
    pub fn approve(ctx: Context<Approve>) -> Result<()> {
        let owner_index = ctx
            .accounts
            .wallet
            .owners
            .iter()
            .position(|i| i == ctx.accounts.owner.key)
            .ok_or(ErrorCode::UnauthorizedOwner)?;

        ctx.accounts.transaction.signers[owner_index] = true;

        Ok(())
    }

    pub fn cancel_approval(ctx: Context<Approve>) -> Result<()> {
        let owner_index = ctx
            .accounts
            .wallet
            .owners
            .iter()
            .position(|i| i == ctx.accounts.owner.key)
            .ok_or(ErrorCode::UnauthorizedOwner)?;

        ctx.accounts.transaction.signers[owner_index] = false;

        Ok(())
    }

    pub fn delete_transaction(ctx: Context<Approve>) -> Result<()>{
        let owner_index = ctx
            .accounts
            .wallet
            .owners
            .iter()
            .position(|i| i == ctx.accounts.owner.key)
            .ok_or(ErrorCode::UnauthorizedOwner)?;
        
        require!(!ctx.accounts.transaction.signers.contains(&true),ErrorCode::CannotDelete);

        let tx = &mut ctx.accounts.transaction;
        tx.deleted = true;
        Ok(())
    }

    pub fn set_owners(ctx: Context<Auth>, owners: Vec<Pubkey>) -> Result<()> {
        are_owners_unique(&owners)?;
        require!(!owners.is_empty(), ErrorCode::ForbiddenLength);

        let wallet = &mut ctx.accounts.wallet;

        if (owners.len() as u64) < wallet.threshold {
            wallet.threshold = owners.len() as u64;
        }

        wallet.owners = owners;
        wallet.owner_seq += 1;

        Ok(())
    }

 
    pub fn change_threshold(ctx: Context<Auth>, threshold: u64) -> Result<()> {
        require!(threshold > 0, InvalidThreshold);
        if threshold > ctx.accounts.wallet.owners.len() as u64 {
            return Err(ErrorCode::InvalidThreshold.into());
        }
        let wallet = &mut ctx.accounts.wallet;
        wallet.threshold = threshold;
        Ok(())
    }

//     pub fn transfer_funds(ctx:Context<Auth>, amount:u64,payer:Pubkey,receiver:Pubkey) -> Result<()> {
//         let ix = anchor_lang::solana_program::system_instruction::transfer(
//         &payer,
//         &receiver,
//         amount
// );
//     anchor_lang::solana_program::program::invoke(&ix,[payer.clone().to_account_info(),receiver.clone().to_account_info()]);

//         Ok(())
//     }

    // Executes the given transaction if threshold owners have signed it.
    pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {
        // Has this been executed already?
        if ctx.accounts.transaction.did_execute {
            return Err(ErrorCode::AlreadyExecuted.into());
        }

        // Do we have enough signers.
        let sig_count = ctx
            .accounts
            .transaction
            .signers
            .iter()
            .filter(|&did_sign| *did_sign)
            .count() as u64;
        if sig_count < ctx.accounts.wallet.threshold {
            return Err(ErrorCode::NotEnoughSigners.into());
        }

        // Execute the transaction signed by the wallet.
        let mut ix: Instruction = (*ctx.accounts.transaction).deref().into();
        ix.accounts = ix
            .accounts
            .iter()
            .map(|acc| {
                let mut acc = acc.clone();
                if &acc.pubkey == ctx.accounts.wallet_signer.key {
                    acc.is_signer = true;
                }
                acc
            })
            .collect();
        let wallet_key = ctx.accounts.wallet.key();
        let seeds = &[wallet_key.as_ref(), &[ctx.accounts.wallet.nonce]];
        let signer = &[&seeds[..]];
        let accounts = ctx.remaining_accounts;
        solana_program::program::invoke_signed(&ix, accounts, signer)?;

        // Burn the transaction to ensure one time use.
        ctx.accounts.transaction.did_execute = true;

        Ok(())
    }
}


impl From<&TransactionAccount> for AccountMeta {
    fn from(account: &TransactionAccount) -> AccountMeta {
        match account.is_writable {
            false => AccountMeta::new_readonly(account.pubkey, account.is_signer),
            true => AccountMeta::new(account.pubkey, account.is_signer),
        }
    }
}

impl From<&AccountMeta> for TransactionAccount {
    fn from(account_meta: &AccountMeta) -> TransactionAccount {
        TransactionAccount {
            pubkey: account_meta.pubkey,
            is_signer: account_meta.is_signer,
            is_writable: account_meta.is_writable,
        }
    }
}

