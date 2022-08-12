import { ethers, network } from "hardhat";
import path from "path";
import fs from "fs";
// eslint-disable-next-line
import hre from "hardhat";

interface IContent {
  Factory: string;
  "Factory-prod": string;
}
async function main() {
  const networkName = hre.network.name;
  const content = JSON.parse(
    fs.readFileSync(
      path.resolve("../frontend/evm-config/ethereum.json"),
      "utf8"
    )
  ) as IContent;

  const Factory = await ethers.getContractFactory("MultisigFactory");
  const tx = await Factory.deploy();
  console.log(tx.address);
  if (network.name === "goerli") {
    console.log("Deploying to goerli");
    content["Factory-prod"] = tx.address;
  } else {
    console.log("Deploying to localhost");
    content.Factory = tx.address;
  }
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
  const Multisig = fs.readFileSync(
    path.resolve("../evm/typechain-types/Multisig.ts"),
    "utf8"
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/Multisig.ts"),
    Multisig
  );
  const MultisigFactory = fs.readFileSync(
    path.resolve("../evm/typechain-types/MultisigFactory.ts"),
    "utf8"
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/MultisigFactory.ts"),
    MultisigFactory
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/Multisig.json"),
    MultisigABI
  );
  const MultisigFactoryABI = fs.readFileSync(
    path.resolve(
      "../evm/artifacts/contracts/Multisig.sol/MultisigFactory.json"
    ),
    "utf8"
  );
  fs.writeFileSync(
    path.resolve("../frontend/evm-config/MultisigFactory.json"),
    MultisigFactoryABI
  );
  return null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
