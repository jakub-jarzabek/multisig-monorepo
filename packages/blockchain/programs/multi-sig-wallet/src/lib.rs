use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program;
use anchor_lang::solana_program::{
    account_info::{
        next_account_info,AccountInfo
    }
};
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

emit!(TransactionCreatedEvent {
            wallet: ctx.accounts.wallet.key(),
            transaction: ctx.accounts.transaction.key(),
            initiator: ctx.accounts.initiator.key(),
        });
        Ok(())
    }

pub fn create_transfer_transaction(
        ctx: Context<CreateTransferTransaction>,
        pid: Pubkey,
        accs: Vec<TransactionAccount>,
        data: Vec<u8>,
        tx_type: u8,
        tx_data: Vec<Pubkey>,
        tx_value: u64,
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
        tx.tx_value = tx_value;
        msg!("Creating Transfer");



        Ok(())
    }

    pub fn test(ctx:Context<Test>,a:u8) ->Result<()>{
        msg!("Test");
      
        let from = ctx.accounts.from.to_account_info();
        msg!("From: {}",from.key);

        

        Ok(())
    }

    pub fn approve(ctx: Context<Approve>) -> Result<()> {
        let owner_index = ctx
            .accounts
            .wallet
            .owners
            .iter()
            .position(|i| i == ctx.accounts.owner.key)
            .ok_or(ErrorCode::UnauthorizedOwner)?;

        ctx.accounts.transaction.signers[owner_index] = true;

    emit!(ApprovedEvent {
        wallet: ctx.accounts.wallet.key(),
        transaction: ctx.accounts.transaction.key(),
        owner: ctx.accounts.owner.key(),
    });

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
    emit!(CancelledAprovalEvent {
        wallet: ctx.accounts.wallet.key(),
        transaction: ctx.accounts.transaction.key(),
        owner: ctx.accounts.owner.key(),
    });
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

 emit!(DeletedEvent {
        wallet: ctx.accounts.wallet.key(),
        transaction: ctx.accounts.transaction.key(),
        owner: ctx.accounts.owner.key(),
    });
        Ok(())
    }

    pub fn set_owners(ctx: Context<Auth>, owners: Vec<Pubkey>) -> Result<()> {
        are_owners_unique(&owners)?;
        require!(!owners.is_empty(), ErrorCode::ForbiddenLength);

        let wallet = &mut ctx.accounts.wallet;

        if (owners.len() as u64) < wallet.threshold {
            wallet.threshold = owners.len() as u64;
        }

        wallet.owners = owners.clone();
        wallet.owner_seq += 1;

        emit!(WalletOwnersSetEvent{
            wallet: wallet.key(),
            owners:owners,
        });
        Ok(())
    }

 
    pub fn change_threshold(ctx: Context<Auth>, threshold: u64) -> Result<()> {
        require!(threshold > 0, InvalidThreshold);
        if threshold > ctx.accounts.wallet.owners.len() as u64 {
            return Err(ErrorCode::InvalidThreshold.into());
        }
        let wallet = &mut ctx.accounts.wallet;
        wallet.threshold = threshold;
        emit!(WalletThresholdSetEvent{
            wallet: wallet.key(),
            threshold,
        });
        Ok(())
    }

    pub fn transfer_funds( ctx:Context<Transfer>,amount:u64) -> Result<()> {
            msg!("Transfering Funds");
        let amount_of_lamports = amount;
        let from = ctx.accounts.from.to_account_info();
        let to = ctx.accounts.to.to_account_info();

      
        **from.try_borrow_mut_lamports()? -= amount_of_lamports;
        **to.try_borrow_mut_lamports()? += amount_of_lamports;

        Ok(())
    }

    pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {
        msg!("Executing Transaction");
        if ctx.accounts.transaction.did_execute {
            return Err(ErrorCode::AlreadyExecuted.into());
        }

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

        ctx.accounts.transaction.did_execute = true;
    emit!(TransactionExecutedEvent {
        wallet: ctx.accounts.wallet.key(),
        transaction: ctx.accounts.transaction.key(),
    });

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

