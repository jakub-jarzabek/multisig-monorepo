import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Multisig, MultisigFactory } from "../typechain-types";
import { ethers } from "hardhat";
import { ContractReceipt } from "ethers";
describe("MultisigDB", async () => {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let owners: string[];
  let external: SignerWithAddress;
  let multisigFactory: MultisigFactory;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owners = [accounts[1].address, accounts[2].address, accounts[3].address];
    deployer = accounts[0];
    external = accounts[4];
    const MultisigFactoryFactory = await ethers.getContractFactory(
      "MultiSigFactory"
    );
    multisigFactory = await MultisigFactoryFactory.deploy();
  });
  it("Should Register wallet in MultisigDB", async () => {
    const tx = await multisigFactory.createMultiSig(owners, 2);
    const result = tx.wait();
    expect((await multisigFactory.getUserWallets()).length).to.be.equal(1);
  });
});
