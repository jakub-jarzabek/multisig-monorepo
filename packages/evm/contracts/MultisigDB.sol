// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MultisigDB {
    mapping(address => address[]) public ownerToWallets;

    function setWallet(address owner, address wallet) external {
        ownerToWallets[owner].push(wallet);
    }

    function getWallets(address owner)
        external
        view
        returns (address[] memory)
    {
        return ownerToWallets[owner];
    }

    function removeWallet(address owner, address wallet) external {
        address[] memory wallets = ownerToWallets[owner];
        for (uint256 i = 0; i <= wallets.length; i++) {
            if (wallets[i] == wallet) {
                delete ownerToWallets[owner][i];
                break;
            }
        }
    }
}
