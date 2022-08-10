import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Multisig, Multisig__factory } from "../typechain-types";
import { ethers } from "hardhat";
import { ContractReceipt } from "ethers";

describe("Multisig", async () => {
  let multisig: Multisig;
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let MultisigFactory: Multisig__factory;
  let owners: string[];
  let external: SignerWithAddress;
  const provider = ethers.getDefaultProvider();
  describe("Wallet creation", async () => {
    beforeEach(async () => {
      accounts = await ethers.getSigners();
      owners = [accounts[1].address, accounts[2].address, accounts[3].address];
      deployer = accounts[0];
      external = accounts[4];
      MultisigFactory = await ethers.getContractFactory("Multisig");
    });
    it("Should create wallet successfully", async () => {
      multisig = (await MultisigFactory.deploy(owners, 2)) as Multisig;
      expect(await multisig.getOwners()).to.deep.equal(owners);
    });
    it("Should fail wallet creation due to threshold", async () => {
      expect(MultisigFactory.deploy(owners, 4)).to.be.revertedWithCustomError(
        multisig,
        "Multisig__Invalid_Threshold"
      );
    });
    it("Should fail wallet creation due to not enugh owners", async () => {
      expect(MultisigFactory.deploy([], 0)).to.be.revertedWithCustomError(
        multisig,
        "Multisig__Not_Enough_Owners"
      );
    });
  });
  describe("Transactions", async () => {
    beforeEach(async () => {
      accounts = await ethers.getSigners();
      owners = [accounts[1].address, accounts[2].address, accounts[3].address];
      deployer = accounts[0];
      MultisigFactory = await ethers.getContractFactory("Multisig");
      multisig = (await MultisigFactory.deploy(owners, 2)) as Multisig;
    });
    it("Should create transaction", async () => {
      const tx = await multisig
        .connect(accounts[1])
        .addTransaction(external.address, 100, "0x");
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === "NewTransaction");
      expect(event?.args?.txIndex).to.equal(0);
      expect(event?.args?.owner).to.equal(accounts[1].address);
      expect(event?.args?.value).to.equal(100);
      expect(event?.args?.to).to.equal(external.address);
    });
    describe("Approvals and deletions", async () => {
      let receipt: ContractReceipt;
      beforeEach(async () => {
        const tx = await multisig
          .connect(accounts[1])
          .addTransaction(external.address, 100, "0x");

        receipt = await tx.wait();
      });
      it("Should approve transaction", async () => {
        const before = await multisig.getTransaction(0);
        await multisig.connect(accounts[2]).approveTransaction(0);
        const after = await multisig.getTransaction(0);
        expect(before.confirmationsCount.toString()).to.eq("0");
        expect(after.confirmationsCount.toString()).to.eq("1");
      });
      it("Should fail double approval", async () => {
        await multisig.connect(accounts[2]).approveTransaction(0);
        expect(
          multisig.connect(accounts[2]).approveTransaction(0)
        ).to.be.revertedWithCustomError(
          multisig,
          "Multisig__Tx_Already_Approved"
        );
      });
      it("Should fail approval by not and owner", async () => {
        expect(
          multisig.connect(external).approveTransaction(0)
        ).to.be.revertedWithCustomError(multisig, "Multisig__Not_An_Owner");
      });
    });
    describe("Execution", async () => {
      let receipt: ContractReceipt;
      beforeEach(async () => {
        const tx = await multisig
          .connect(accounts[1])
          .addTransaction(external.address, 100, await multisig.testCall());

        receipt = await tx.wait();
      });

      it("Should fail transaction Execution when threshold is not met", async () => {
        expect(
          multisig.connect(accounts[1]).executeTransaction(0)
        ).to.be.revertedWithCustomError(
          multisig,
          "Multisig__Not_Enough_Signers"
        );
      });
      it("Should Successfuly execute Transaction", async () => {
        await multisig.connect(accounts[3]).approveTransaction(0);
        await multisig.connect(accounts[1]).approveTransaction(0);
        await multisig.connect(accounts[2]).approveTransaction(0);
        const tx = await multisig
          .connect(accounts[1])
          .deposit({ value: ethers.utils.parseEther("1") });
        const receipt = await tx.wait();
        await multisig.connect(accounts[1]).executeTransaction(0);

        expect(await (await multisig.getTransaction(0)).didExecute).to.eq(true);
      });
      it("Should prevent double execution", async () => {
        await multisig.connect(accounts[3]).approveTransaction(0);
        await multisig.connect(accounts[1]).approveTransaction(0);
        await multisig.connect(accounts[2]).approveTransaction(0);
        const tx = await multisig
          .connect(accounts[1])
          .deposit({ value: ethers.utils.parseEther("1") });
        const receipt = await tx.wait();
        await multisig.connect(accounts[1]).executeTransaction(0);

        expect(
          multisig.connect(accounts[1]).executeTransaction(0)
        ).to.be.revertedWithCustomError(
          multisig,
          "Multisig__Tx_Already_Executed"
        );
      });
      describe("State Managment", async () => {
        it("Should change owners and treshold", async () => {
          const newOwners = [accounts[4].address];
          const newTreshold = 1;
          const tx = await multisig
            .connect(accounts[1])
            .addInternalTransaction(newOwners, newTreshold);
          const receipt = await tx.wait();
          await multisig.connect(accounts[3]).approveInternalTransaction(0);
          await multisig.connect(accounts[1]).approveInternalTransaction(0);
          await multisig.connect(accounts[2]).approveInternalTransaction(0);
          await multisig.connect(accounts[2]).executeInternalTransaction(0);

          expect(await multisig.threshold()).to.eq(1);
          expect(await multisig.getOwners()).to.deep.eq(newOwners);
        });
      });
    });
  });
});
