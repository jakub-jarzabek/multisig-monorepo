import { ethers, network } from "hardhat";
import path from "path";
import fs from "fs";

interface IContent {
  DB: string;
}
async function main() {
  const content = JSON.parse(
    fs.readFileSync(
      path.resolve("./packages/frontend/evm-config/ethereum.json"),
      "utf8"
    )
  ) as IContent;

  const DB = await ethers.getContractFactory("MultisigDB");
  const tx = await DB.deploy();
  content.DB = tx.address;
  fs.writeFileSync(
    path.resolve("./packages/frontend/evm-config/ethereum.json"),
    JSON.stringify(content)
  );

  return null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
