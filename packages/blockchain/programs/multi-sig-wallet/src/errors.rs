use crate::*;
#[error_code]
pub enum ErrorCode {
    #[msg("Owner is unauthorized for this wallet")]
    UnauthorizedOwner,
    #[msg("Owners must be unique")]
    NotUniqueOwners,
    #[msg("Owners array cannot be empty")]
    ForbiddenLength,
    #[msg("Not enoguh signers")]
    NotEnoughSigners,
    #[msg("Cannot delete transaction signed by an owner")]
    TransactionAlreadySigned,
    #[msg("Overflow when adding.")]
    Overflow,
    #[msg("Cannot delete transaction not created by current user")]
    DeleteForbidden,
    #[msg("Transaction already Executed")]
    AlreadyExecuted,
    #[msg("Threshold must be grater than zero and less than or equal to the number of owners.")]
    InvalidThreshold,
    #[msg("Transaction cannot be deleted")]
    CannotDelete,
}
