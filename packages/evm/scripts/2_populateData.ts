import { ethers, network } from "hardhat";
import path from "path";
import fs from "fs";
import add from "../utils/add.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractReceipt } from "ethers";

async function main() {
  const accounts = await ethers.getSigners();
  const owners = [
    accounts[0].address,
    accounts[1].address,
    accounts[2].address,
    accounts[3].address,
  ];
  const deployer = accounts[0];
  const external = accounts[4];
  const MultisigFactory = await ethers.getContractFactory("Multisig");
  const multisig = await MultisigFactory.deploy(owners, 2);
  const multisig2 = await MultisigFactory.deploy(owners, 2);
  const multisig3 = await MultisigFactory.deploy(owners, 2);

  return null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
