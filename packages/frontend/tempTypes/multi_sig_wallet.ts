export type MultiSigWallet = {
  "version": "0.1.0",
  "name": "multi_sig_wallet",
  "instructions": [
    {
      "name": "createWallet",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "threshold",
          "type": "u64"
        },
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initiator",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pid",
          "type": "publicKey"
        },
        {
          "name": "accs",
          "type": {
            "vec": {
              "defined": "TransactionAccount"
            }
          }
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "txType",
          "type": "u8"
        },
        {
          "name": "txData",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "txValue",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTransferTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [SmartWallet]."
          ]
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Transaction]."
          ]
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pid",
          "type": "publicKey"
        },
        {
          "name": "accs",
          "type": {
            "vec": {
              "defined": "TransactionAccount"
            }
          }
        },
        {
          "name": "txType",
          "type": "u8"
        },
        {
          "name": "txData",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "txValue",
          "type": "u64"
        },
        {
          "name": "instructions",
          "type": {
            "vec": {
              "defined": "TXInstruction"
            }
          }
        }
      ]
    },
    {
      "name": "approve",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "cancelApproval",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "deleteTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setOwners",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeThreshold",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferFunds",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeTransferTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "threshold",
            "type": "u64"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "numTransfer",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TransactionAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "txType",
            "type": "u8"
          },
          {
            "name": "txData",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "txValue",
            "type": "u64"
          },
          {
            "name": "deleted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "transferTransaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TransactionAccount"
              }
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "txType",
            "type": "u8"
          },
          {
            "name": "txData",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "txValue",
            "type": "u64"
          },
          {
            "name": "deleted",
            "type": "bool"
          },
          {
            "name": "instructions",
            "type": {
              "vec": {
                "defined": "TXInstruction"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TXInstruction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "docs": [
              "Pubkey of the instruction processor that executes this instruction"
            ],
            "type": "publicKey"
          },
          {
            "name": "keys",
            "docs": [
              "Metadata for what accounts should be passed to the instruction processor"
            ],
            "type": {
              "vec": {
                "defined": "TXAccountMeta"
              }
            }
          },
          {
            "name": "data",
            "docs": [
              "Opaque data passed to the instruction processor"
            ],
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "TXAccountMeta",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "docs": [
              "An account's public key"
            ],
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "docs": [
              "True if an Instruction requires a Transaction signature matching `pubkey`."
            ],
            "type": "bool"
          },
          {
            "name": "isWritable",
            "docs": [
              "True if the `pubkey` can be loaded as a read-write account."
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TransactionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "WalletCreatedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "threshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WalletOwnersSetEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "WalletThresholdSetEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "threshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "TransactionCreatedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "initiator",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ApprovedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CancelledAprovalEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "DeletedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "TransactionExecutedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedOwner",
      "msg": "Owner is unauthorized for this wallet"
    },
    {
      "code": 6001,
      "name": "NotUniqueOwners",
      "msg": "Owners must be unique"
    },
    {
      "code": 6002,
      "name": "ForbiddenLength",
      "msg": "Owners array cannot be empty"
    },
    {
      "code": 6003,
      "name": "NotEnoughSigners",
      "msg": "Not enoguh signers"
    },
    {
      "code": 6004,
      "name": "TransactionAlreadySigned",
      "msg": "Cannot delete transaction signed by an owner"
    },
    {
      "code": 6005,
      "name": "Overflow",
      "msg": "Overflow when adding."
    },
    {
      "code": 6006,
      "name": "DeleteForbidden",
      "msg": "Cannot delete transaction not created by current user"
    },
    {
      "code": 6007,
      "name": "AlreadyExecuted",
      "msg": "Transaction already Executed"
    },
    {
      "code": 6008,
      "name": "InvalidThreshold",
      "msg": "Threshold must be grater than zero and less than or equal to the number of owners."
    },
    {
      "code": 6009,
      "name": "CannotDelete",
      "msg": "Transaction cannot be deleted"
    }
  ]
};

export const IDL: MultiSigWallet = {
  "version": "0.1.0",
  "name": "multi_sig_wallet",
  "instructions": [
    {
      "name": "createWallet",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "threshold",
          "type": "u64"
        },
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initiator",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "pid",
          "type": "publicKey"
        },
        {
          "name": "accs",
          "type": {
            "vec": {
              "defined": "TransactionAccount"
            }
          }
        },
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "txType",
          "type": "u8"
        },
        {
          "name": "txData",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "txValue",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createTransferTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [SmartWallet]."
          ]
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The [Transaction]."
          ]
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pid",
          "type": "publicKey"
        },
        {
          "name": "accs",
          "type": {
            "vec": {
              "defined": "TransactionAccount"
            }
          }
        },
        {
          "name": "txType",
          "type": "u8"
        },
        {
          "name": "txData",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "txValue",
          "type": "u64"
        },
        {
          "name": "instructions",
          "type": {
            "vec": {
              "defined": "TXInstruction"
            }
          }
        }
      ]
    },
    {
      "name": "approve",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "cancelApproval",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "deleteTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setOwners",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeThreshold",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferFunds",
      "accounts": [
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "walletSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeTransferTransaction",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "wallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owners",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "threshold",
            "type": "u64"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "numTransfer",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TransactionAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "txType",
            "type": "u8"
          },
          {
            "name": "txData",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "txValue",
            "type": "u64"
          },
          {
            "name": "deleted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "transferTransaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TransactionAccount"
              }
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "didExecute",
            "type": "bool"
          },
          {
            "name": "ownerSeq",
            "type": "u32"
          },
          {
            "name": "txType",
            "type": "u8"
          },
          {
            "name": "txData",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "txValue",
            "type": "u64"
          },
          {
            "name": "deleted",
            "type": "bool"
          },
          {
            "name": "instructions",
            "type": {
              "vec": {
                "defined": "TXInstruction"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TXInstruction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "docs": [
              "Pubkey of the instruction processor that executes this instruction"
            ],
            "type": "publicKey"
          },
          {
            "name": "keys",
            "docs": [
              "Metadata for what accounts should be passed to the instruction processor"
            ],
            "type": {
              "vec": {
                "defined": "TXAccountMeta"
              }
            }
          },
          {
            "name": "data",
            "docs": [
              "Opaque data passed to the instruction processor"
            ],
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "TXAccountMeta",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "docs": [
              "An account's public key"
            ],
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "docs": [
              "True if an Instruction requires a Transaction signature matching `pubkey`."
            ],
            "type": "bool"
          },
          {
            "name": "isWritable",
            "docs": [
              "True if the `pubkey` can be loaded as a read-write account."
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TransactionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "WalletCreatedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "threshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WalletOwnersSetEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owners",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "WalletThresholdSetEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "threshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "TransactionCreatedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "initiator",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ApprovedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CancelledAprovalEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "DeletedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "TransactionExecutedEvent",
      "fields": [
        {
          "name": "wallet",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "transaction",
          "type": "publicKey",
          "index": true
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedOwner",
      "msg": "Owner is unauthorized for this wallet"
    },
    {
      "code": 6001,
      "name": "NotUniqueOwners",
      "msg": "Owners must be unique"
    },
    {
      "code": 6002,
      "name": "ForbiddenLength",
      "msg": "Owners array cannot be empty"
    },
    {
      "code": 6003,
      "name": "NotEnoughSigners",
      "msg": "Not enoguh signers"
    },
    {
      "code": 6004,
      "name": "TransactionAlreadySigned",
      "msg": "Cannot delete transaction signed by an owner"
    },
    {
      "code": 6005,
      "name": "Overflow",
      "msg": "Overflow when adding."
    },
    {
      "code": 6006,
      "name": "DeleteForbidden",
      "msg": "Cannot delete transaction not created by current user"
    },
    {
      "code": 6007,
      "name": "AlreadyExecuted",
      "msg": "Transaction already Executed"
    },
    {
      "code": 6008,
      "name": "InvalidThreshold",
      "msg": "Threshold must be grater than zero and less than or equal to the number of owners."
    },
    {
      "code": 6009,
      "name": "CannotDelete",
      "msg": "Transaction cannot be deleted"
    }
  ]
};
