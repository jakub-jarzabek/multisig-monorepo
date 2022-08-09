import { ethers, network } from "hardhat";
import path from "path";
import fs from "fs";

interface IContent {
  DB: string;
}
async function main() {
  const content = JSON.parse(
    fs.readFileSync(
      path.resolve("../frontend/evm-config/ethereum.json"),
      "utf8"
    )
  ) as IContent;

  const DB = await ethers.getContractFactory("MultisigDB");
  const tx = await DB.deploy();
  content.DB = tx.address;
  console.log(tx.address);
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/ethereum.json"),
    JSON.stringify(content)
  );
  fs.writeFileSync(
    path.resolve("../evm/utils/add.json"),
    JSON.stringify(content)
  );
  const MultisigABI = fs.readFileSync(
    path.resolve("../evm/artifacts/contracts/Multisig.sol/Multisig.json"),
    "utf8"
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/Multisig.json"),
    MultisigABI
  );
  const MultisigDBABI = fs.readFileSync(
    path.resolve("../evm/artifacts/contracts/MultisigDB.sol/MultisigDB.json"),
    "utf8"
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/MultisigDB.json"),
    MultisigDBABI
  );
  return null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
