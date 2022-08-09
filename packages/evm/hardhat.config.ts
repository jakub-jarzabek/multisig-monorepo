import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.9',

  networks: {
    localhost: {
      allowUnlimitedContractSize: true,
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
};

export default config;
