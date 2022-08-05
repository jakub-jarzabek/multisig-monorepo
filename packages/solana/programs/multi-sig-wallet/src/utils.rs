use anchor_lang::prelude::*;
use crate::*;

use errors::ErrorCode;

pub fn are_owners_unique(owners: &[Pubkey]) -> Result<()> {
    for (i, owner) in owners.iter().enumerate() {
        require!(
            !owners.iter().skip(i + 1).any(|item| item == owner),
            ErrorCode::NotUniqueOwners
        )
    }
    Ok(())
}
