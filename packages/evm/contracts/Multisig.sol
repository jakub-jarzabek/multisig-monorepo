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

contract Multisig {
    event Deposit(address indexed sender, uint256 value, uint256 balance);
    event NewTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event NewInternalTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address[] owners,
        uint256 threshold
    );
    event ApproveTransaction(address indexed owner, uint256 indexed txIndex);
    event UnApproveTransaction(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public threshold;

    struct Tx {
        address to;
        uint256 value;
        bytes data;
        bool didExecute;
        uint256 confirmationsCount;
    }
    struct InternalTx {
        address[] owners;
        uint256 threshold;
        bool didExecute;
        uint256 confirmationsCount;
    }

    Tx[] public transactions;
    InternalTx[] public internalTransactions;
    mapping(uint256 => mapping(address => bool)) public isApprovedByOwner;
    mapping(uint256 => mapping(address => bool))
        public isInternalApprovedByOwner;

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

    constructor(
        address[] memory _owners,
        uint256 _threshold,
        address DBAddress
    ) {
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
            bytes memory data = abi.encodeWithSignature(
                "setWallet(address,address)",
                owner,
                address(this)
            );

            (bool success, ) = DBAddress.call{value: 0}(data);

            if (!success) {
                revert Multisig__Write_To_DB_Failed();
            }
        }

        threshold = _threshold;
    }

    function deposit() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function addTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner {
        uint256 txIndex = transactions.length;

        transactions.push(
            Tx({
                to: _to,
                value: _value,
                data: _data,
                didExecute: false,
                confirmationsCount: 0
            })
        );

        emit NewTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function addInternalTransaction(
        address[] memory _owners,
        uint256 _threshold
    ) public onlyOwner {
        uint256 txIndex = internalTransactions.length;

        internalTransactions.push(
            InternalTx({
                owners: _owners,
                threshold: _threshold,
                didExecute: false,
                confirmationsCount: 0
            })
        );

        emit NewInternalTransaction(msg.sender, txIndex, owners, threshold);
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

        emit UnApproveTransaction(msg.sender, _txIndex);
    }

    function approveInternalTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        InternalTx storage transaction = internalTransactions[_txIndex];
        transaction.confirmationsCount += 1;
        isInternalApprovedByOwner[_txIndex][msg.sender] = true;

        emit ApproveTransaction(msg.sender, _txIndex);
    }

    function revokeInternalApproval(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        InternalTx storage transaction = internalTransactions[_txIndex];

        if (!isApprovedByOwner[_txIndex][msg.sender]) {
            revert Multisig__Tx_Not_Approved();
        }

        transaction.confirmationsCount -= 1;
        isInternalApprovedByOwner[_txIndex][msg.sender] = false;

        emit UnApproveTransaction(msg.sender, _txIndex);
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

        transaction.didExecute = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        if (!success) {
            revert Multisig__Tx_Execution_Failed();
        }

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function executeInternalTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        InternalTx storage transaction = internalTransactions[_txIndex];

        if (transaction.confirmationsCount < threshold) {
            revert Multisig__Not_Enough_Signers();
        }

        transaction.didExecute = true;
        setThreshold(transaction.threshold);
        setOwners(transaction.owners);

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function setThreshold(uint256 _threshold) internal onlyOwner {
        if (_threshold > owners.length || _threshold <= 0) {
            revert Multisig__Invalid_Threshold();
        }
        threshold = _threshold;
    }

    function setOwners(address[] memory _owners) internal onlyOwner {
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

    function testCall() public pure returns (bytes memory) {
        return abi.encodeWithSignature("notExist()");
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
}
