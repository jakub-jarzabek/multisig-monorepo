import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Multisig, MultisigFactory } from "../typechain-types";
import ABI from "../artifacts/contracts/Multisig.sol/Multisig.json";
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
      "MultisigFactory"
    );
    multisigFactory =
      (await MultisigFactoryFactory.deploy()) as MultisigFactory;
  });
  it("Should Register wallet in MultisigDB", async () => {
    const tx = await multisigFactory.createMultiSig(owners, 2);
    const result = tx.wait();
    expect(
      (await multisigFactory.connect(accounts[1]).getUserWallets()).length
    ).to.be.equal(1);
  });
  it("Should get contract data", async () => {
    const tx = await multisigFactory
      .connect(accounts[1])
      .createMultiSig(owners, 2);
    const result = tx.wait();
    const wallets = await multisigFactory.connect(accounts[1]).getUserWallets();
    const walletAddres = wallets[0].walletAddress;
    const contract = new ethers.Contract(walletAddres, ABI.abi, accounts[1]);
    expect(await contract.getOwners()).to.deep.equal(owners);
    expect(await contract.threshold()).equal(2);
  });
  it("Should ", async () => {
    console.log(accounts[0].address);
    const wallets = await multisigFactory.connect(accounts[0]).getUserWallets();
    console.log(wallets);
  });
});
