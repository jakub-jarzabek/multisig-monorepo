// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error Multisig__NotEnoughSigners();
error Multisig__Not_An_Owner();
error Multisig__Not_Enough_Owners();
error Multisig__Tx_Does_Not_Exist();
error Multisig__Tx_Already_Executed();
error Multisig__Tx_Already_Confirmed();
error Multisig__Tx_Not_Confirmed();
error Multisig__Invalid_Threshold();
error Multisig__Invalid_Owner();
error Multisig__Owners_Must_Be_Unique();

contract Multisig {
    event Deposit(address indexed sender, uint256 value, uint256 balance);
    event NewTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
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
        uint256 threshold;
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
            revert Multisig__Tx_Already_Confirmed();
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

    function addTx(
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
                threshold: 0
            })
        );

        emit NewTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function approveTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];
        transaction.threshold += 1;
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
            revert Multisig__Tx_Not_Confirmed();
        }

        transaction.threshold -= 1;
        isApprovedByOwner[_txIndex][msg.sender] = false;

        emit UnApproveTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Tx storage transaction = transactions[_txIndex];

        if (transaction.threshold < threshold) {
            revert Multisig__NotEnoughSigners();
        }

        transaction.didExecute = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, 'tx failed');

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function _setThreshold(uint256 _threshold) internal onlyOwner {
        if (_threshold > owners.length || _threshold <= 0) {
            revert Multisig__Invalid_Threshold();
        }
        threshold = _threshold;
    }

    function _setOwners(address[] memory _owners) internal onlyOwner {
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

    function getSetTreshholdData(uint256 _threshold)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature('setThreshold(uint256)', _threshold);
    }

    function getSetOwnersData(address[] memory _owners)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature('setOwners(address[])', _owners);
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
            bool executed,
            uint256 numConfirmations
        )
    {
        Tx storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.didExecute,
            transaction.threshold
        );
    }
}
