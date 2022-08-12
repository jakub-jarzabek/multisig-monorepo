// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error Multisig__Not_Enough_Signers();
error Multisig__Not_An_Owner();
error Multisig__Not_Enough_Owners();
error Multisig__Tx_Does_Not_Exist();
error Multisig__Tx_Already_Executed();
error Multisig__Tx_Already_Approved();
error Multisig__Tx_Not_Approved();
error Multisig__Invalid_Threshold();
error Multisig__Invalid_Owner();
error Multisig__Owners_Must_Be_Unique();
error Multisig__Tx_Execution_Failed();
error Multisig__Write_To_DB_Failed();
error Multisig__Cannot_Execute_Deleted_Transaction();
error Multisig__Transaction_Already_Deleted();
error Multisig__Cannot_Delete_Signed_Transaction();

contract Multisig {
    enum TransactionType {
        SET_OWNERS,
        SET_THRESHOLD,
        TRANSFER,
        EXTERNAL
    }
    event Deposit(address indexed sender, uint256 value, uint256 balance);
    event NewTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data,
        TransactionType txType
    );

    event ApproveTransaction(address indexed owner, uint256 indexed txIndex);
    event DeleteTransaction(address indexed owner, uint256 indexed txIndex);
    event UnApproveTransaction(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public threshold;
    address DBAddress;

    struct Tx {
        uint256 createdAt;
        bytes32 txHash;
        uint256 index;
        address to;
        uint256 value;
        bytes data;
        bool didExecute;
        bool isDeleted;
        address[] signers;
        address[] owners;
        uint256 threshold;
        TransactionType txType;
        uint256 confirmationsCount;
    }

    Tx[] public transactions;
    mapping(uint256 => mapping(address => bool)) public isApprovedByOwner;

    modifier onlyOwner() {
        if (!isOwner[msg.sender]) {
            revert Multisig__Not_An_Owner();
        }
        _;
    }
    modifier txExists(uint256 _txIndex) {
        if (_txIndex >= transactions.length) {
            revert Multisig__Tx_Does_Not_Exist();
        }
        _;
    }
    modifier notExecuted(uint256 _txIndex) {
        if (transactions[_txIndex].didExecute) {
            revert Multisig__Tx_Already_Executed();
        }
        _;
    }
    modifier notConfirmed(uint256 _txIndex) {
        if (isApprovedByOwner[_txIndex][msg.sender]) {
            revert Multisig__Tx_Already_Approved();
        }
        _;
    }

    constructor(address[] memory _owners, uint256 _threshold) {
        if (_owners.length == 0) {
            revert Multisig__Not_Enough_Owners();
        }
        if (_threshold > _owners.length || _threshold <= 0) {
            revert Multisig__Invalid_Threshold();
        }

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            if (owner == address(0)) {
                revert Multisig__Invalid_Owner();
            }
            if (isOwner[owner]) {
                revert Multisig__Owners_Must_Be_Unique();
            }
            isOwner[owner] = true;
            owners.push(owner);
        }

        threshold = _threshold;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function addTransaction(
        address _to,
        uint256 _value,
        bytes memory _data,
        address[] memory _owners,
        uint256 _threshold,
        TransactionType _txType
    ) public onlyOwner {
        uint256 txIndex = transactions.length;

        transactions.push(
            Tx({
                createdAt: block.timestamp,
                txHash: keccak256(abi.encodePacked(txIndex, block.timestamp)),
                index: txIndex,
                to: _to,
                value: _value,
                data: _data,
                didExecute: false,
                isDeleted: false,
                owners: _owners,
                threshold: _threshold,
                txType: _txType,
                confirmationsCount: 0,
                signers: new address[](0)
            })
        );

        emit NewTransaction(msg.sender, txIndex, _to, _value, _data, _txType);
    }

    function approveTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];
        transaction.confirmationsCount += 1;
        isApprovedByOwner[_txIndex][msg.sender] = true;
        transaction.signers.push(msg.sender);

        emit ApproveTransaction(msg.sender, _txIndex);
    }

    function revokeApproval(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];

        if (!isApprovedByOwner[_txIndex][msg.sender]) {
            revert Multisig__Tx_Not_Approved();
        }

        transaction.confirmationsCount -= 1;
        isApprovedByOwner[_txIndex][msg.sender] = false;
        for (uint256 i = 0; i <= transaction.signers.length; i++) {
            if (transaction.signers[i] == msg.sender) {
                delete transaction.signers[i];
                break;
            }
        }

        emit UnApproveTransaction(msg.sender, _txIndex);
    }

    function deleteTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];

        if (transaction.isDeleted) {
            revert Multisig__Transaction_Already_Deleted();
        }
        if (transaction.confirmationsCount != 0) {
            revert Multisig__Cannot_Delete_Signed_Transaction();
        }

        transaction.isDeleted = true;

        emit DeleteTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];

        if (transaction.confirmationsCount < threshold) {
            revert Multisig__Not_Enough_Signers();
        }
        if (transaction.isDeleted) {
            revert Multisig__Cannot_Execute_Deleted_Transaction();
        }

        transaction.didExecute = true;
        if (transaction.txType == TransactionType.EXTERNAL) {
            (bool success, ) = transaction.to.call{value: transaction.value}(
                transaction.data
            );

            if (!success) {
                revert Multisig__Tx_Execution_Failed();
            }
        }

        if (transaction.txType == TransactionType.SET_OWNERS) {
            setOwners(transaction.owners);
        }
        if (transaction.txType == TransactionType.SET_THRESHOLD) {
            setThreshold(transaction.threshold);
        }
        if (transaction.txType == TransactionType.TRANSFER) {
            payable(transaction.to).transfer(transaction.value);
        }

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function setThreshold(uint256 _threshold) internal onlyOwner {
        if (_threshold > owners.length || _threshold <= 0) {
            revert Multisig__Invalid_Threshold();
        }
        threshold = _threshold;
    }

    function setOwners(address[] memory _owners) internal onlyOwner {
        for (uint256 i = 0; i < owners.length; i++) {
            isOwner[owners[i]] = false;
        }
        delete owners;
        if (_owners.length == 0) {
            revert Multisig__Not_Enough_Owners();
        }

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            if (owner == address(0)) {
                revert Multisig__Invalid_Owner();
            }
            if (isOwner[owner]) {
                revert Multisig__Owners_Must_Be_Unique();
            }
            isOwner[owner] = true;
            owners.push(owner);
        }
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool didExecute,
            uint256 confirmationsCount
        )
    {
        Tx storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.didExecute,
            transaction.confirmationsCount
        );
    }

    function isApprovedBySender(uint256 index) public view returns (bool) {
        return isApprovedByOwner[index][msg.sender];
    }

    function getTransactions() public view returns (Tx[] memory) {
        return transactions;
    }
}

contract MultisigFactory {
    struct UserWallets {
        address walletAddress;
        uint256 walletID;
    }

    uint256 id = 0;
    UserWallets[] public wallets;
    Multisig[] public multisigInstances;

    mapping(address => UserWallets[]) userWallet;
    event multisigInstanceCreated(
        uint256 date,
        address walletOwner,
        address multiSigAddress
    );

    function createMultiSig(address[] memory _owners, uint256 _threshold)
        public
        returns (Multisig)
    {
        Multisig newWalletInstance = new Multisig(_owners, _threshold);
        multisigInstances.push(newWalletInstance);

        for (uint256 i = 0; i < _owners.length; i++) {
            UserWallets[] storage newWallet = userWallet[_owners[i]];
            newWallet.push(UserWallets(address(newWalletInstance), id));
        }
        emit multisigInstanceCreated(
            block.timestamp,
            msg.sender,
            address(newWalletInstance)
        );
        id++;
        return newWalletInstance;
    }

    function getUserWallets()
        public
        view
        returns (UserWallets[] memory walets)
    {
        return userWallet[msg.sender];
    }
}
