import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "../../.env" });

const url = `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;
const accounts = [process.env.PRIVATE_KEY ?? ""];

const config: HardhatUserConfig = {
  solidity: "0.8.9",

  networks: {
    localhost: {
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url,
      accounts: accounts,
    },
  },
};

export default config;
