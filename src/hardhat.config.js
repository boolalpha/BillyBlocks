/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const ALCHEMY_MUMBAI_API_URL = process.env.ALCHEMY_MUMBAI_API_URL;
const ALCHEMY_POLYGON_API_URL = process.env.ALCHEMY_POLYGON_API_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
    solidity: "0.8.13",
    defaultNetwork: "mumbai",
    networks: {
        hardhat: {},
        rinkeby: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${METAMASK_PRIVATE_KEY}`]
        },
        mumbai: {
            url: ALCHEMY_MUMBAI_API_URL,
            accounts: [`0x${METAMASK_PRIVATE_KEY}`]
        },
        polygon: {
            url: ALCHEMY_POLYGON_API_URL,
            accounts: [`0x${METAMASK_PRIVATE_KEY}`]
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    }
};
