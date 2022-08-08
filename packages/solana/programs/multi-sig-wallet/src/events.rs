use crate::*;

#[event]
pub struct WalletCreatedEvent {
    #[index]
    pub wallet: Pubkey,
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
}

#[event]
pub struct WalletOwnersSetEvent {
    #[index]
    pub wallet: Pubkey,
    pub owners: Vec<Pubkey>,
}

#[event]
pub struct WalletThresholdSetEvent {
    #[index]
    pub wallet: Pubkey,
    pub threshold: u64,
}
#[event]
pub struct TransactionCreatedEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub initiator: Pubkey,
}

#[event]
pub struct ApprovedEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub owner: Pubkey,
}

#[event]
pub struct CancelledAprovalEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub owner: Pubkey,
}

#[event]
pub struct DeletedEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub owner: Pubkey,
}

#[event]
pub struct TransactionExecutedEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
}

#[event]
pub struct TransferExecutedEvent {
    #[index]
    pub wallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}
