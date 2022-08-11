export const parseTransaction = (tx: any) => {
  return {
    publicKey: tx.txHash.toString(),
    account: {
      didExecute: tx.didExecute,
      deleted: tx.isDeleted,
      to: tx.to.toString(),
      txType: Number(tx.txType.toString()),
      ownerSeq: 1,
      createdAt: tx.createdAt,
      value: tx.value,
      txValue: tx.type === 2 ? tx.Value : tx.treshold,
      txData: tx.type === 0 ? tx.owners : [tx.to.toString()],
      threshold: Number(tx.confirmationsCount.toString()),
      index: tx.index,
      signers: tx.signers,
    },
  };
};
