import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Multisig, MultisigDB, Multisig__factory } from "../typechain-types";
import { ethers } from "hardhat";
import { ContractReceipt } from "ethers";
describe("MultisigDB", async () => {
  let multisig: Multisig;
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let MultisigFactory: Multisig__factory;
  let owners: string[];
  let external: SignerWithAddress;
  let multisigDB: MultisigDB;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owners = [accounts[1].address, accounts[2].address, accounts[3].address];
    deployer = accounts[0];
    external = accounts[4];
    MultisigFactory = await ethers.getContractFactory("Multisig");
    const MultisigDBFactory = await ethers.getContractFactory("MultisigDB");
    multisigDB = await MultisigDBFactory.deploy();
  });
  it("Should Register wallet in MultisigDB", async () => {
    multisig = (await MultisigFactory.deploy(
      owners,
      2,
      multisigDB.address
    )) as Multisig;
    expect(await multisigDB.getWallets(accounts[1].address)).to.deep.equal([
      multisig.address,
    ]);
    expect(await multisigDB.getWallets(accounts[2].address)).to.deep.equal([
      multisig.address,
    ]);
    expect(await multisigDB.getWallets(accounts[3].address)).to.deep.equal([
      multisig.address,
    ]);
  });
});
